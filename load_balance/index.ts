import { Worker } from "worker_threads";
import { fork, ChildProcess } from "child_process";
import * as http from "http";

export enum LoadBalanceSelectType {
    RoundRobin = "RoundRobin",
    RandomRobin = "RandomRobin",
    Manual = "Manual",
}

export enum LoadBalanceconnectMode {
    WorkerThreads = "WorkerThreads",
    ChildProcess = "ChildProcess",
    Proxy = "Proxy",
}

export interface LoadBalanceMap {
    connectMode: LoadBalanceconnectMode,
    proxy?: string,
    worker? : Worker,
    ChildProcess? : ChildProcess,
}

export interface LoadBalanceOption {
    type : LoadBalanceSelectType;
    maps : Array<LoadBalanceMap>;
    ports?: Array<number>,
    httpsPorts?: Array<number>,
    workPath: string,
}

export class LoadBalancer {

    private workers : Array<Worker> = [];

    private requestBuffer = {};

    private rrIndex : number = 0;

    private options : LoadBalanceOption;

    public constructor(options : LoadBalanceOption){
        this.options = options;
        for (let n = 0 ; n < options.maps.length ; n++) {
            const map = options.maps[n];
            if (
                map.connectMode == LoadBalanceconnectMode.WorkerThreads || 
                map.connectMode == LoadBalanceconnectMode.ChildProcess
            ) {

                const onMessage = (value)=>{
                    if (!value.qid){ return; }
                    if (!value.cmd){ return; }

                    const buffer = this.requestBuffer[value.qid];
                    if(!buffer){ return; }
    
                    if (value.cmd == "end") {

                        const h = Object.keys(value.data.headers);
                        for (let n2 = 0 ; n2 < h.length ; n2++ ){
                            const hName = h[n2];
                            const hValue = value.data.headers[hName];
                            buffer.res.setHeader(hName, hValue);
                        }

                        if (!value.data.statusCode){
                            value.data.statusCode = 200;
                        }
                        buffer.res.statusCode = value.data.statusCode;

                        buffer.res.write(value.data.body);
                        buffer.res.end();
                        delete this.requestBuffer[value.qid];
                    }
                    else if(value.cmd == "settimeout"){
                        buffer.res.setTimeout(value.data);
                    }
                };

                if (map.connectMode == LoadBalanceconnectMode.WorkerThreads) {
                    map.worker = new Worker(__dirname + "/worker", {
                        argv: [n, this.options.workPath],
                    });    
                    map.worker.on("message", onMessage);
                }
                else if (map.connectMode == LoadBalanceconnectMode.ChildProcess){
                    map.ChildProcess = fork(__dirname + "/worker", {
                        execArgv: [__dirname + "/worker", n.toString(), this.options.workPath],
                    });
                    map.ChildProcess.on("message", onMessage);
                }

            }
            else if (map.connectMode == LoadBalanceconnectMode.Proxy) {

                // proxy....

            }

        }

        const h = http.createServer((req, res)=>{
            const qid = Math.random();
            this.requestBuffer[qid] = {
                req: req,
                res: res
            };

            const sendData = {
                url: req.url,
                method: req.method,
                headers: req.headers,
                remoteAddress: req.socket.remoteAddress,
                remortPort: req.socket.remotePort,
                remoteFamily: req.socket.remoteFamily,
            };

            const map = this.getMap();

            this.send(map, {
                qid: qid,
                cmd: "begin",
                data: sendData,
            });

            req.on("end", ()=>{
                this.send(map, {
                    qid: qid,
                    cmd: "end",
                    data: sendData,
                });
            });

            req.on("data", (value)=>{
                this.send(map, {
                    qid: qid,
                    cmd: "data",
                    data: sendData,
                    postbuffer: value,
                });
            });

            req.on("close", ()=>{
                this.send(map, {
                    qid: qid,
                    cmd: "close",
                    data: sendData,
                });
            });
            req.on("error", (error : Error)=>{
                this.send(map, {
                    qid: qid,
                    cmd: "error",
                    data: sendData,
                    error: error,
                });
            });
            req.on("pause", ()=>{
                this.send(map, {
                    qid: qid,
                    cmd: "pause",
                    data: sendData,
                });
            });
            req.on("resume",()=>{
                this.send(map, {
                    qid: qid,
                    cmd: "resume",
                    data: sendData,
                });
            });
        });
        h.listen(1100);
    }

    private getMap(){
        if (this.options.type ==LoadBalanceSelectType.RoundRobin) {
            if(this.rrIndex >= this.options.maps.length){
                this.rrIndex = 0;
            }           
            this.rrIndex++; 
            return this.options.maps[this.rrIndex - 1];
        }
        else if (this.options.type == LoadBalanceSelectType.RandomRobin){
            const index = parseInt((Math.random()*1000).toString()) % this.options.maps.length;
            return this.options.maps[index];
        }
    }

    private send(map, sendMessage){
        if (map.connectMode == LoadBalanceconnectMode.WorkerThreads){
            map.worker.postMessage(sendMessage);
        }        
        else if (map.connectMode == LoadBalanceconnectMode.ChildProcess){
            map.ChildProcess.send(sendMessage);
        }
    }

}

export class HttpRequest {

    public url : string;
    public method : string;
    public headers; 
    public remoteAddress : string;
    public remotePort;
    public remoteFamily : string;

    private pp;

    public constructor(data, pp?){
        this.url = data.url;
        this.method = data.method;
        this.headers = data.headers;
        this.remoteAddress = data.remoteAddress;
        this.remotePort = data.remotePort;
        this.remoteFamily = data.remoteFamily;
        if (pp){
            this.pp = pp;
        }
    }
}

export class HttpResponse {

    private qid;

    private pp;

    private headers = {};

    private statusCode : number;

    private text : string = "";

    private writeEnd : boolean = false

    public constructor(qid, req, pp?){
        this.qid = qid;
        if(pp){
            this.pp = pp;
        }
    }

    public write(text: string){
        this.text += text;
        return this;
    }

    public setHeader(name: string, value : string | number) {
        this.headers[name] = value;
        return this;
    }

    public end(){
        if (this.writeEnd){
            return;
        }
        this.writeEnd = true;
        const send = {
            qid: this.qid,
            cmd: "end",
            data: {
                body: this.text,
                statusCode: this.statusCode,
                headers: this.headers,
            },
        };
        if(this.pp){
            this.pp.postMessage(send);
        }
        else{
            process.send(send);
        }
    }
}

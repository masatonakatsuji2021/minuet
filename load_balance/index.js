"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadBalancerListner = exports.LoadBalanceThread = exports.HttpResponse = exports.HttpRequest = exports.LoadBalancer = exports.LoadBalanceconnectMode = exports.LoadBalanceSelectType = void 0;
const worker_threads_1 = require("worker_threads");
const child_process_1 = require("child_process");
const http = require("http");
const https = require("https");
var LoadBalanceSelectType;
(function (LoadBalanceSelectType) {
    LoadBalanceSelectType["RoundRobin"] = "RoundRobin";
    LoadBalanceSelectType["RandomRobin"] = "RandomRobin";
    LoadBalanceSelectType["Manual"] = "Manual";
})(LoadBalanceSelectType || (exports.LoadBalanceSelectType = LoadBalanceSelectType = {}));
var LoadBalanceconnectMode;
(function (LoadBalanceconnectMode) {
    LoadBalanceconnectMode["WorkerThreads"] = "WorkerThreads";
    LoadBalanceconnectMode["ChildProcess"] = "ChildProcess";
    LoadBalanceconnectMode["Proxy"] = "Proxy";
})(LoadBalanceconnectMode || (exports.LoadBalanceconnectMode = LoadBalanceconnectMode = {}));
class LoadBalancer {
    constructor(options) {
        this.requestBuffer = {};
        this.rrIndex = 0;
        this.options = options;
        for (let n = 0; n < options.maps.length; n++) {
            const map = options.maps[n];
            map.threadNo = n;
            if (map.connectMode == LoadBalanceconnectMode.WorkerThreads ||
                map.connectMode == LoadBalanceconnectMode.ChildProcess) {
                const sendData = {
                    cmd: "listen-start",
                    data: {
                        threadNo: map.threadNo,
                        workPath: this.options.workPath,
                    },
                };
                if (map.connectMode == LoadBalanceconnectMode.WorkerThreads) {
                    map.worker = new worker_threads_1.Worker(__dirname + "/worker");
                }
                else if (map.connectMode == LoadBalanceconnectMode.ChildProcess) {
                    map.ChildProcess = (0, child_process_1.fork)(__dirname + "/child_process");
                }
                this.send(map, sendData);
                this.on(map, "message", (value) => {
                    this.onMessage(map, value);
                });
            }
            else if (map.connectMode == LoadBalanceconnectMode.Proxy) {
                // proxy....
            }
        }
        if (options.ports) {
            for (let n = 0; n < options.ports.length; n++) {
                const port = options.ports[n];
                const h = http.createServer((req, res) => {
                    this.serverListen(req, res);
                });
                h.listen(port);
            }
        }
        if (options.httpsPorts) {
            for (let n = 0; n < options.httpsPorts.length; n++) {
                const port = options.httpsPorts[n];
                const h = https.createServer((req, res) => {
                    this.serverListen(req, res);
                });
                h.listen(port);
            }
        }
    }
    onMessage(map, value) {
        if (!value.qid) {
            return;
        }
        if (!value.cmd) {
            return;
        }
        const buffer = this.requestBuffer[value.qid];
        if (!buffer) {
            return;
        }
        if (value.cmd == "end") {
            const h = Object.keys(value.data.headers);
            for (let n2 = 0; n2 < h.length; n2++) {
                const hName = h[n2];
                const hValue = value.data.headers[hName];
                buffer.res.setHeader(hName, hValue);
            }
            if (!value.data.statusCode) {
                value.data.statusCode = 200;
            }
            buffer.res.statusCode = value.data.statusCode;
            buffer.res.write(value.data.body);
            buffer.res.end();
            delete this.requestBuffer[value.qid];
        }
        else if (value.cmd == "on") {
            if (!value.event) {
                return;
            }
            buffer.req.on(value.event, (data) => {
                this.send(map, {
                    qid: value.qid,
                    cmd: "on-receive",
                    data: data,
                });
            });
        }
        else if (value.cmd == "settimeout") {
            buffer.res.setTimeout(value.data);
        }
    }
    serverListen(req, res) {
        const qid = Math.random();
        this.requestBuffer[qid] = { req, res };
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
        req.on("end", () => {
            this.send(map, {
                qid: qid,
                cmd: "end",
                data: sendData,
            });
        });
        req.on("data", (value) => {
            this.send(map, {
                qid: qid,
                cmd: "data",
                data: sendData,
                postbuffer: value,
            });
        });
        req.on("close", () => {
            this.send(map, {
                qid: qid,
                cmd: "close",
                data: sendData,
            });
        });
        req.on("error", (error) => {
            this.send(map, {
                qid: qid,
                cmd: "error",
                data: sendData,
                error: error,
            });
        });
        req.on("pause", () => {
            this.send(map, {
                qid: qid,
                cmd: "pause",
                data: sendData,
            });
        });
        req.on("resume", () => {
            this.send(map, {
                qid: qid,
                cmd: "resume",
                data: sendData,
            });
        });
    }
    getMap() {
        if (this.options.type == LoadBalanceSelectType.RoundRobin) {
            if (this.rrIndex >= this.options.maps.length) {
                this.rrIndex = 0;
            }
            this.rrIndex++;
            return this.options.maps[this.rrIndex - 1];
        }
        else if (this.options.type == LoadBalanceSelectType.RandomRobin) {
            const index = parseInt((Math.random() * 1000).toString()) % this.options.maps.length;
            return this.options.maps[index];
        }
    }
    send(map, sendMessage) {
        if (map.connectMode == LoadBalanceconnectMode.WorkerThreads) {
            map.worker.postMessage(sendMessage);
        }
        else if (map.connectMode == LoadBalanceconnectMode.ChildProcess) {
            map.ChildProcess.send(sendMessage);
        }
    }
    on(map, event, callback) {
        if (map.connectMode == LoadBalanceconnectMode.WorkerThreads) {
            map.worker.on(event, callback);
        }
        else if (map.connectMode == LoadBalanceconnectMode.ChildProcess) {
            map.ChildProcess.on(event, callback);
        }
    }
}
exports.LoadBalancer = LoadBalancer;
class HttpRequest {
    constructor(qid, data, pp) {
        this.onEventHandle = {};
        this.qid = qid;
        this.url = data.url;
        this.method = data.method;
        this.headers = data.headers;
        this.remoteAddress = data.remoteAddress;
        this.remotePort = data.remotePort;
        this.remoteFamily = data.remoteFamily;
        if (pp) {
            this.pp = pp;
        }
    }
    on(event, callback) {
        const send = {
            qid: this.qid,
            cmd: "on",
            event: event,
        };
        if (this.pp) {
            this.pp.postMessage(send);
        }
        else {
            process.send(send);
        }
    }
}
exports.HttpRequest = HttpRequest;
class HttpResponse {
    constructor(qid, req, pp) {
        this.headers = {};
        this.text = "";
        this.writeEnd = false;
        this.qid = qid;
        if (pp) {
            this.pp = pp;
        }
    }
    write(text) {
        this.text += text;
        return this;
    }
    setHeader(name, value) {
        this.headers[name] = value;
        return this;
    }
    end() {
        if (this.writeEnd) {
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
                statusMessage: this.statusMessage,
            },
        };
        if (this.pp) {
            this.pp.postMessage(send);
        }
        else {
            process.send(send);
        }
    }
}
exports.HttpResponse = HttpResponse;
class LoadBalanceThread {
    constructor(workerFlg) {
        this.workerFlg = false;
        this.requestBuffer = {};
        this.workerFlg = workerFlg;
        if (this.workerFlg) {
            worker_threads_1.parentPort.on("message", (value) => {
                this.onMessage(value);
            });
        }
        else {
            process.on("message", (value) => {
                this.onMessage(value);
            });
        }
    }
    onMessage(value) {
        if (!value.cmd) {
            return;
        }
        if (value.cmd == "listen-start") {
            this.threadNo = value.data.threadNo;
            this.Listener = require(value.data.workPath).default;
            return;
        }
        if (!value.qid) {
            return;
        }
        if (value.cmd == "begin") {
            let req, res;
            if (this.workerFlg) {
                req = new HttpRequest(value.qid, value.data, worker_threads_1.parentPort);
                res = new HttpResponse(value.qid, req, worker_threads_1.parentPort);
            }
            else {
                req = new HttpRequest(value.qid, value.data);
                res = new HttpResponse(value.qid, req);
            }
            const listener = new this.Listener();
            this.requestBuffer[value.qid] = { listener, req, res };
            return;
        }
        if (!this.requestBuffer[value.qid]) {
            return;
        }
        const listener = this.requestBuffer[value.qid].listener;
        const req = this.requestBuffer[value.qid].req;
        const res = this.requestBuffer[value.qid].res;
        if (listener.request) {
            listener.request(req, res, this.threadNo);
        }
        if (value.md == "data") {
            if (listener.onData) {
                listener.onData(value.postbuffer, req, res, this.threadNo);
            }
        }
        else if (value.cmd == "end") {
            if (listener.onEnd) {
                listener.onEnd(req, res, this.threadNo);
            }
        }
        else if (value.cmd == "close") {
            if (listener.onClose) {
                listener.onClose(req, res, this.threadNo);
            }
            delete this.requestBuffer[value.qid];
        }
        else if (value.cmd == "error") {
            if (listener.onError) {
                listener.onError(value.error, req, res, this.threadNo);
            }
            delete this.requestBuffer[value.qid];
        }
        else if (value.cmd == "pause") {
            if (listener.onPause) {
                listener.onPause(req, res, this.threadNo);
            }
        }
        else if (value.cmd == "resume") {
            if (listener.onResume) {
                listener.onResume(req, res, this.threadNo);
            }
        }
    }
}
exports.LoadBalanceThread = LoadBalanceThread;
class LoadBalancerListner {
}
exports.LoadBalancerListner = LoadBalancerListner;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponse = exports.HttpRequest = exports.LoadBalancer = exports.LoadBalanceconnectMode = exports.LoadBalanceSelectType = void 0;
const worker_threads_1 = require("worker_threads");
const child_process_1 = require("child_process");
const http = require("http");
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
        this.workers = [];
        this.requestBuffer = {};
        this.rrIndex = 0;
        this.options = options;
        for (let n = 0; n < options.maps.length; n++) {
            const map = options.maps[n];
            if (map.connectMode == LoadBalanceconnectMode.WorkerThreads ||
                map.connectMode == LoadBalanceconnectMode.ChildProcess) {
                const onMessage = (value) => {
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
                    else if (value.cmd == "settimeout") {
                        buffer.res.setTimeout(value.data);
                    }
                };
                if (map.connectMode == LoadBalanceconnectMode.WorkerThreads) {
                    map.worker = new worker_threads_1.Worker(__dirname + "/worker", {
                        argv: [n, this.options.workPath],
                    });
                    map.worker.on("message", onMessage);
                }
                else if (map.connectMode == LoadBalanceconnectMode.ChildProcess) {
                    map.ChildProcess = (0, child_process_1.fork)(__dirname + "/worker", {
                        execArgv: [__dirname + "/worker", n.toString(), this.options.workPath],
                    });
                    map.ChildProcess.on("message", onMessage);
                }
            }
            else if (map.connectMode == LoadBalanceconnectMode.Proxy) {
                // proxy....
            }
        }
        const h = http.createServer((req, res) => {
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
        });
        h.listen(1100);
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
}
exports.LoadBalancer = LoadBalancer;
class HttpRequest {
    constructor(data, pp) {
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

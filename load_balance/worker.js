"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const _1 = require("./");
const threadNo = process.argv[2];
const workerPath = process.argv[3];
const Listener = require(workerPath).default;
let requestBuffer = {};
worker_threads_1.parentPort.on("message", (value) => {
    if (!value.qid) {
        return;
    }
    if (!value.cmd) {
        return;
    }
    if (value.cmd == "begin") {
        const req = new _1.HttpRequest(value.data, worker_threads_1.parentPort);
        const res = new _1.HttpResponse(value.qid, req, worker_threads_1.parentPort);
        const listener = new Listener();
        requestBuffer[value.qid] = {
            listener,
            req,
            res
        };
        return;
    }
    if (!requestBuffer[value.qid]) {
        return;
    }
    const listener = requestBuffer[value.qid].listener;
    const req = requestBuffer[value.qid].req;
    const res = requestBuffer[value.qid].res;
    if (value.md == "data") {
        if (listener.onData) {
            listener.onData(value.postbuffer, req, res, threadNo);
        }
    }
    else if (value.cmd == "end") {
        if (listener.onEnd) {
            listener.onEnd(req, res, threadNo);
        }
    }
    else if (value.cmd == "close") {
        if (listener.onClose) {
            listener.onClose(req, res, threadNo);
        }
        delete requestBuffer[value.qid];
    }
    else if (value.cmd == "error") {
        if (listener.onError) {
            listener.onError(value.error, req, res, threadNo);
        }
        delete requestBuffer[value.qid];
    }
    else if (value.cmd == "pause") {
        if (listener.onPause) {
            listener.onPause(req, res, threadNo);
        }
    }
    else if (value.cmd == "resume") {
        if (listener.onResume) {
            listener.onResume(req, res, threadNo);
        }
    }
});

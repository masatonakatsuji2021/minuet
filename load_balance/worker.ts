import { parentPort } from "worker_threads";
import { HttpRequest, HttpResponse } from "./";

const threadNo = process.argv[2];
const workerPath = process.argv[3];
const Listener = require(workerPath).default;

let requestBuffer = {};

parentPort.on("message", (value)=>{

    if (!value.qid){ return; }
    if (!value.cmd){ return; }

    if (value.cmd == "begin"){
        const req = new HttpRequest(value.data, parentPort);
        const res = new HttpResponse(value.qid, req, parentPort);
        const listener = new Listener();

        requestBuffer[value.qid] = {
            listener,
            req,
            res
        };
        return;
    }

    if (!requestBuffer[value.qid]){ return; }

    const listener = requestBuffer[value.qid].listener;
    const req = requestBuffer[value.qid].req;
    const res = requestBuffer[value.qid].res;

    if (value.md=="data"){
        if (listener.onData){
            listener.onData(value.postbuffer, req, res, threadNo);
        }
    }
    else if (value.cmd == "end"){
        if (listener.onEnd){
            listener.onEnd(req, res, threadNo);
        }
    }
    else if (value.cmd == "close") {
        if (listener.onClose){
            listener.onClose(req, res, threadNo);
        }
        delete requestBuffer[value.qid];
    }
    else if (value.cmd == "error") {
        if (listener.onError){
            listener.onError(value.error, req, res, threadNo);
        }
        delete requestBuffer[value.qid];
    }
    else if (value.cmd == "pause") {
        if (listener.onPause){
            listener.onPause(req, res, threadNo);
        }
    }
    else if (value.cmd == "resume") {
        if (listener.onResume){
            listener.onResume(req, res, threadNo);
        }
    } 
});
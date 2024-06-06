"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Listener {
    constructor() {
        this.post = "";
    }
    onData(data) {
        this.post += data.toString();
    }
    onEnd(req, res, threadNo) {
        if (this.post) {
            console.log(this.post.toString());
        }
        res.setHeader("name", "minuet-server.19.0.0");
        res.statusMessage = "A, R, E!!";
        res.write("OK.....ThreadNo=" + threadNo);
        res.end();
    }
}
exports.default = Listener;

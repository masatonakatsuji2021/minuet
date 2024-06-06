"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const load_balance_1 = require("./load_balance");
class Listener extends load_balance_1.LoadBalancerListner {
    constructor() {
        super(...arguments);
        this.post = "";
    }
    onData(buffer, req, res) {
        this.post += buffer;
    }
    onEnd(req, res, threadNo) {
        if (this.post) {
            console.log(this.post.toString());
        }
        res.setHeader("name", "minuet-server.19.0.0");
        res.write("OK.....ThreadNo=" + threadNo);
        res.end();
    }
}
exports.default = Listener;

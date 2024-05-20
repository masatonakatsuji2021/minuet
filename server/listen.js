"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const MServerListen = () => {
    const h = http.createServer((req, res) => {
        console.log(req.url);
        res.write("Hallow OK");
        res.end();
    });
    h.listen(8021);
};
exports.default = MServerListen;

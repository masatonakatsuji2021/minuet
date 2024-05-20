"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const mcli_1 = require("../cmd/mcli");
const construct_1 = require("../core/construct");
const MServerStop = () => {
    if (!fs.existsSync(construct_1.default.workPidPath)) {
        mcli_1.default.yellown("Already Not Found Minuet Server...");
        return;
    }
    const pid = parseInt(fs.readFileSync(construct_1.default.workPidPath).toString());
    try {
        process.kill(pid);
    }
    catch (error) {
        fs.unlinkSync(construct_1.default.workPidPath);
        mcli_1.default.yellown("Not Found Minuet Server...");
        mcli_1.default.outn("  PID   = " + pid.toString());
        return;
    }
    fs.unlinkSync(construct_1.default.workPidPath);
    mcli_1.default.greenn("Minuet Server Stop .... OK");
    mcli_1.default.outn("  PID   = " + pid.toString());
};
exports.default = MServerStop;

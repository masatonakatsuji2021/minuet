"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = require("fs");
const path = require("path");
const mcli_1 = require("../cmd/mcli");
const construct_1 = require("../core/construct");
const MServerStart = (directExecFlg) => {
    if (directExecFlg) {
        mcli_1.default.greenn("Minuet Server Begin (Direct Execution Mode) .... OK");
        require("./worker");
        return;
    }
    const work = (0, child_process_1.spawn)("node", [__dirname + "/worker.js"], {
        stdio: "ignore",
        detached: true,
    });
    work.unref();
    const pid = work.pid;
    if (!fs.existsSync(path.dirname(construct_1.default.workPidPath))) {
        fs.mkdirSync(path.dirname(construct_1.default.workPidPath), {
            recursive: true,
        });
    }
    fs.writeFileSync(construct_1.default.workPidPath, pid.toString());
    mcli_1.default.greenn("Minuet Server Begin .... OK");
    mcli_1.default.outn("  PID   = " + pid.toString());
};
exports.default = MServerStart;

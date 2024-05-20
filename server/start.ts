import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import Mcli from "../cmd/mcli";
import Construct from "../core/construct";

const MServerStart = (directExecFlg? : boolean) => {

    if (directExecFlg) {
        Mcli.greenn("Minuet Server Begin (Direct Execution Mode) .... OK");
        require("./worker");
        return;
    }

    const work = spawn("node", [__dirname + "/worker.js"], {
        stdio: "ignore",
        detached: true,
    });
    work.unref();
    const pid = work.pid;

    if (!fs.existsSync(path.dirname(Construct.workPidPath))){
        fs.mkdirSync(path.dirname(Construct.workPidPath), {
            recursive: true,
        });
    }
    fs.writeFileSync(Construct.workPidPath, pid.toString());

    Mcli.greenn("Minuet Server Begin .... OK");
    Mcli.outn("  PID   = " + pid.toString());
};
export default MServerStart;
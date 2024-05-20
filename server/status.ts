import * as fs from "fs";
import Mcli from "../cmd/mcli";
import Construct from "../core/construct";
import * as os from "os";
import { exec } from "child_process";

const MServerStatus = async ()=>{

    Mcli.outn("Minuet Server Status").br().outn("[Status]");

    if (!fs.existsSync(Construct.workPidPath)) {
        Mcli.redn("✕  Minuet server application is not running");
        return;
    }

    const pid = parseInt(fs.readFileSync(Construct.workPidPath).toString());

    if (os.platform() == "linux") {
        // linux case....
        const pidExists = await (()=> {
            return new Promise((resolve) => {
                exec("ps -p " + pid.toString(), (err, stdout) => {
                    if (stdout) {
                        if (stdout.indexOf("minuet-worker") > -1) {
                            resolve(true);
                            return;
                        }
                    }

                    resolve(false);
                });     
            });
        });

        if (!pidExists) {
            Mcli.redn("✕  Minuet server application is not found (pid= " + pid.toString() + ")");
            return;
        }
    }
    else if (os.platform() == "win32") {
        // windows case...
        const pidExists = await (()=> {
            return new Promise((resolve) => {
                exec(`tasklist /FI "PID eq ${pid.toString()}"`, (err, stdout) => {
                    if (stdout) {
                        if (stdout.indexOf("minuet-worker") > -1) {
                            resolve(true);
                            return;
                        }
                    }
                });        
            });
        });

        if (!pidExists) {
            Mcli.redn("✕  Minuet server application is not found (pid= " + pid.toString() + ")");
            return;
        }
    }
    else {

    }

    Mcli.greenn("●  No Problem");
};
export default MServerStatus;
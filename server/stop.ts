import * as fs from "fs";
import Mcli from "../cmd/mcli";
import Construct from "../core/construct";

const MServerStop = () => {

    if (!fs.existsSync(Construct.workPidPath)) {
        Mcli.yellown("Already Not Found Minuet Server...");
        return;
    }

    const pid = parseInt(fs.readFileSync(Construct.workPidPath).toString());

    try{
        process.kill(pid);
    }catch(error){
        fs.unlinkSync(Construct.workPidPath);
        Mcli.yellown("Not Found Minuet Server...");
        Mcli.outn("  PID   = " + pid.toString());
        return;
    }

    fs.unlinkSync(Construct.workPidPath);
    Mcli.greenn("Minuet Server Stop .... OK");
    Mcli.outn("  PID   = " + pid.toString());
};
export default MServerStop;
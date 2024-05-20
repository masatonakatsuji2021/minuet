import * as os from "os";
import * as fs from "fs";
import { exec } from "child_process";
import Construct from "../core/construct";

export default () => {
    if(os.platform() == "linux"){
        exec("sudo mkdir " + Construct.rootDir);
        exec("sudo mkdir " + Construct.tempDir);
        exec("sudo mkdir " + Construct.sectorDir);
    }
    else if (os.platform() == "win32") {
        if (!fs.existsSync(Construct.rootDir)){
            fs.mkdirSync(Construct.rootDir, {
                recursive: true,
            });
        }
        if (!fs.existsSync(Construct.tempDir)){
            fs.mkdirSync(Construct.tempDir, {
                recursive: true,
            });
        }
        if (!fs.existsSync(Construct.sectorDir)){
            fs.mkdirSync(Construct.sectorDir, {
                recursive: true,
            });
        }
    }

};

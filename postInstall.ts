import * as os from "os";
import * as fs from "fs";
import { exec } from "child_process";
import Mcli from "./cmd/mcli";
import Construct from "./core/construct";
import * as yaml from "js-yaml";

const init = yaml.dump({
    user: Construct.user,
    group: Construct.group,
});

if (os.platform() == "linux") {

    (async ()=>{
        await (()=>{
            return new Promise((resolve) => {
                Mcli.outn("- Add User " + Construct.user);
                exec("sudo useradd " + Construct.user, (error) => {
                    if(error){
                        Mcli.yellow("[WARM] " + error.toString());
                    }
                    resolve(true);
                });
            });
        })();

        await (()=>{
            return new Promise((resolve) => {
                Mcli.outn("- Mkdir " + Construct.rootDir);
                exec("sudo mkdir " + Construct.rootDir, (error)=>{
                    if(error){
                        Mcli.yellow("[WARM] " + error.toString());
                    }
                    resolve(true);
                });
            });
        })();

        await (()=>{
            return new Promise((resolve) => {
                Mcli.outn("- Chown " + Construct.user + ":" + Construct.group);
                exec("sudo chown -R " + Construct.user + ":" + Construct.group + " " + Construct.rootDir, (error)=>{
                    if(error){
                        Mcli.yellow("[WARM] " + error.toString());
                    }
                    resolve(true);
                });
            });
        })();

        await(()=>{
            return new Promise((resolve) => {



            });
        })();

    })();

}
else if(os.platform() == "win32") {

    if (!fs.existsSync(Construct.rootDir)){
        fs.mkdirSync(Construct.rootDir, {
            recursive:true,
        });
    }
}
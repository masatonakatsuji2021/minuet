"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require("js-yaml");
const aa = yaml.dump({
    aaaa: "bbbb",
    ccc: 123,
});
console.log(aa);
/*
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

*/ 

import Mcli from "./mcli";
import MServerStart from "../server/start";
import MServerStop from "../server/stop";
import MServerStatus from "../server/status";
import MCommandCreateSector from "./createSector";

export default async () => {

    let args = process.argv;
    args.shift();
    args.shift();
    let command : string = "";
    if (args.length == 0) {

        Mcli
            .outn("=======================================================")
            .outn("### ##    ####    ######   ###  ##  #######   ######")
            .outn("#######    ##     ## ####  ###  ##  ##        # ## #")
            .outn("## # ##    ##     ##  ###  ##   ##  ####        ##")
            .outn("## # ##    ##     ##  ###  ##   ##  ##          ##")
            .outn("##   ##   ####    ##  ###   ######  #######     ##")
            .outn("=======================================================")
            .br()
        ;

        while(!command) {
            command = await Mcli.in("Command");

            if (!command) {
                Mcli.red("   [Error] ").outn("Command not entered. retry.");
            }
        }

    }
    else {
        command = args.shift();
    }

    if (command == "start") {
        if (args.indexOf("-d") > -1){
            MServerStart(true);
        }
        else {
            MServerStart();
        }
    }
    else if (command == "stop") {
        MServerStop();
    }
    else if (command == "restart") {
        MServerStop();
        MServerStart();
    }
    else if (command == "status") {
        MServerStatus();
    }
    else if (command == "sector-add") {
        MCommandCreateSector();
    }
    else if (command == "sector-import") {
        
    }
    else if (command == "sector-import") {
        
    }

};
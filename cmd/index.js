"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcli_1 = require("./mcli");
const start_1 = require("../server/start");
const stop_1 = require("../server/stop");
const status_1 = require("../server/status");
const createSector_1 = require("./createSector");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    let args = process.argv;
    args.shift();
    args.shift();
    let command = "";
    if (args.length == 0) {
        mcli_1.default
            .outn("=======================================================")
            .outn("### ##    ####    ######   ###  ##  #######   ######")
            .outn("#######    ##     ## ####  ###  ##  ##        # ## #")
            .outn("## # ##    ##     ##  ###  ##   ##  ####        ##")
            .outn("## # ##    ##     ##  ###  ##   ##  ##          ##")
            .outn("##   ##   ####    ##  ###   ######  #######     ##")
            .outn("=======================================================")
            .br();
        while (!command) {
            command = yield mcli_1.default.in("Command");
            if (!command) {
                mcli_1.default.red("   [Error] ").outn("Command not entered. retry.");
            }
        }
    }
    else {
        command = args.shift();
    }
    if (command == "start") {
        if (args.indexOf("-d") > -1) {
            (0, start_1.default)(true);
        }
        else {
            (0, start_1.default)();
        }
    }
    else if (command == "stop") {
        (0, stop_1.default)();
    }
    else if (command == "restart") {
        (0, stop_1.default)();
        (0, start_1.default)();
    }
    else if (command == "status") {
        (0, status_1.default)();
    }
    else if (command == "sector-add") {
        (0, createSector_1.default)();
    }
    else if (command == "sector-import") {
    }
    else if (command == "sector-import") {
    }
});

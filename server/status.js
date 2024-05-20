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
const fs = require("fs");
const mcli_1 = require("../cmd/mcli");
const construct_1 = require("../core/construct");
const os = require("os");
const child_process_1 = require("child_process");
const MServerStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    mcli_1.default.outn("Minuet Server Status").br().outn("[Status]");
    if (!fs.existsSync(construct_1.default.workPidPath)) {
        mcli_1.default.redn("✕  Minuet server application is not running");
        return;
    }
    const pid = parseInt(fs.readFileSync(construct_1.default.workPidPath).toString());
    if (os.platform() == "linux") {
        // linux case....
        const pidExists = yield (() => {
            return new Promise((resolve) => {
                (0, child_process_1.exec)("ps -p " + pid.toString(), (err, stdout) => {
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
            mcli_1.default.redn("✕  Minuet server application is not found (pid= " + pid.toString() + ")");
            return;
        }
    }
    else if (os.platform() == "win32") {
        // windows case...
        const pidExists = yield (() => {
            return new Promise((resolve) => {
                (0, child_process_1.exec)(`tasklist /FI "PID eq ${pid.toString()}"`, (err, stdout) => {
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
            mcli_1.default.redn("✕  Minuet server application is not found (pid= " + pid.toString() + ")");
            return;
        }
    }
    else {
    }
    mcli_1.default.greenn("●  No Problem");
});
exports.default = MServerStatus;

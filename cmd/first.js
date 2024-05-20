"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const fs = require("fs");
const child_process_1 = require("child_process");
const construct_1 = require("../core/construct");
exports.default = () => {
    if (os.platform() == "linux") {
        (0, child_process_1.exec)("sudo mkdir " + construct_1.default.rootDir);
        (0, child_process_1.exec)("sudo mkdir " + construct_1.default.tempDir);
        (0, child_process_1.exec)("sudo mkdir " + construct_1.default.sectorDir);
    }
    else if (os.platform() == "win32") {
        if (!fs.existsSync(construct_1.default.rootDir)) {
            fs.mkdirSync(construct_1.default.rootDir, {
                recursive: true,
            });
        }
        if (!fs.existsSync(construct_1.default.tempDir)) {
            fs.mkdirSync(construct_1.default.tempDir, {
                recursive: true,
            });
        }
        if (!fs.existsSync(construct_1.default.sectorDir)) {
            fs.mkdirSync(construct_1.default.sectorDir, {
                recursive: true,
            });
        }
    }
};

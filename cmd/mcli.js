"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const ColorCode = {
    reset: '\u001b[0m',
    black: '\u001b[30m',
    red: '\u001b[31m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    blue: '\u001b[34m',
    magenta: '\u001b[35m',
    cyan: '\u001b[36m',
    white: '\u001b[37m',
};
class Mcli {
    static out(text) {
        process.stdout.write(text);
        return Mcli;
    }
    out(text) {
        return Mcli.out(text);
    }
    static br() {
        process.stdout.write("\n");
        return Mcli;
    }
    br() {
        return Mcli.br();
    }
    static outn(text) {
        let indentStr = "";
        if (Mcli._indent) {
            for (let n = 0; n < Mcli._indent; n++) {
                indentStr += "  ";
            }
        }
        return Mcli.out(indentStr + text).br();
    }
    outn(text) {
        return Mcli.outn(text);
    }
    static outColor(text, ColorCode) {
        return Mcli.out("\u001b[" + ColorCode + text + "\u001b[0m");
    }
    outColor(text, ColorCode) {
        return Mcli.outColor(text, ColorCode);
    }
    static outnColor(text, ColorCode) {
        return Mcli.outColor(text + "\n", ColorCode);
    }
    outnColor(text, ColorCode) {
        return Mcli.outnColor(text, ColorCode);
    }
    static red(text) {
        return Mcli.outColor(text, ColorCode.red);
    }
    red(text) {
        return Mcli.red(text);
    }
    static redn(text) {
        return Mcli.red(text).br();
    }
    redn(text) {
        return Mcli.redn(text);
    }
    static blue(text) {
        return Mcli.outColor(text, ColorCode.blue);
    }
    blue(text) {
        return Mcli.blue(text);
    }
    static bluen(text) {
        return Mcli.blue(text).br();
    }
    bluen(text) {
        return Mcli.bluen(text);
    }
    static green(text) {
        return Mcli.outColor(text, ColorCode.green);
    }
    green(text) {
        return Mcli.green(text);
    }
    static greenn(text) {
        return Mcli.green(text).br();
    }
    greenn(text) {
        return Mcli.greenn(text);
    }
    static yellow(text) {
        return Mcli.outColor(text, ColorCode.yellow);
    }
    yellow(text) {
        return Mcli.yellow(text);
    }
    static yellown(text) {
        return Mcli.yellow(text).br();
    }
    yellown(text) {
        return Mcli.yellown(text);
    }
    static magenta(text) {
        return Mcli.outColor(text, ColorCode.magenta);
    }
    magenta(text) {
        return Mcli.magenta(text);
    }
    static magentan(text) {
        return Mcli.magenta(text).br();
    }
    magentan(text) {
        return Mcli.magentan(text);
    }
    static cyan(text) {
        return Mcli.outColor(text, ColorCode.cyan);
    }
    cyan(text) {
        return Mcli.cyan(text);
    }
    static cyann(text) {
        return Mcli.cyan(text).br();
    }
    cyann(text) {
        return Mcli.cyann(text);
    }
    static in(text, sepalateText) {
        if (text) {
            if (!sepalateText) {
                sepalateText = ":";
            }
            Mcli.out(text + " " + sepalateText);
        }
        const reader = readline.createInterface({
            output: process.stdout,
            input: process.stdin,
        });
        return new Promise((resolve) => {
            reader.on('line', (line) => {
                resolve(line.trim());
                reader.close();
            });
        });
    }
    in(text) {
        return Mcli.in(text);
    }
    static indent(setIndent) {
        Mcli._indent = setIndent;
        return Mcli;
    }
    indent(setIndent) {
        return Mcli.indent(setIndent);
    }
    static indentUp() {
        Mcli._indent++;
        return Mcli;
    }
    indentUp() {
        return Mcli.indentUp();
    }
    static indentDown() {
        Mcli._indent--;
        return Mcli;
    }
    indentDown() {
        return Mcli.indentDown();
    }
    static indentReset() {
        Mcli._indent = 0;
        return Mcli;
    }
    indentReset() {
        return Mcli.indentReset();
    }
}
Mcli._indent = 0;
exports.default = Mcli;

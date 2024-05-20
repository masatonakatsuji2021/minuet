import * as readline from "readline";

const ColorCode = {
    reset : '\u001b[0m',
    black : '\u001b[30m',
    red   : '\u001b[31m',
    green : '\u001b[32m',
    yellow : '\u001b[33m',
    blue    : '\u001b[34m',
    magenta : '\u001b[35m',
    cyan    : '\u001b[36m',
    white   : '\u001b[37m',
};

export default class Mcli {

    private static _indent : number = 0;

    public static out(text: string) : Mcli {
        process.stdout.write(text);
        return Mcli;
    }

    public out(text: string) : Mcli {
        return Mcli.out(text);
    }

    public static br() : Mcli {
        process.stdout.write("\n");
        return Mcli;
    }

    public br() : Mcli {
        return Mcli.br();
    }

    public static outn(text: string) : Mcli {
        let indentStr : string = "";
        if (Mcli._indent){
            for (let n = 0 ; n < Mcli._indent ; n++ ) {
                indentStr += "  ";
            }
        }
        return Mcli.out(indentStr + text).br();
    }

    public outn(text: string) : Mcli {
        return Mcli.outn(text);
    }

    public static outColor(text: string, ColorCode: string) : Mcli {
        return Mcli.out("\u001b[" + ColorCode + text + "\u001b[0m");
    }

    public outColor(text: string, ColorCode : string) : Mcli {
        return Mcli.outColor(text, ColorCode);
    }

    public static outnColor(text: string, ColorCode: string) : Mcli {
        return Mcli.outColor(text + "\n", ColorCode);
    }

    public outnColor(text: string, ColorCode: string) : Mcli {
        return Mcli.outnColor(text, ColorCode);
    }

    public static red(text: string) : Mcli {
        return Mcli.outColor(text, ColorCode.red);
    }

    public red(text: string) : Mcli {
        return Mcli.red(text);
    }

    public static redn(text: string): Mcli {
        return Mcli.red(text).br();
    }

    public redn(text: string) : Mcli {
        return Mcli.redn(text);
    }

    public static blue(text: string) : Mcli {
        return Mcli.outColor(text, ColorCode.blue);
    }

    public blue(text: string) : Mcli {
        return Mcli.blue(text);
    }

    public static bluen(text: string) : Mcli {
        return Mcli.blue(text).br();
    }

    public bluen(text: string) : Mcli {
        return Mcli.bluen(text);
    }

    public static green(text: string) : Mcli {
        return Mcli.outColor(text, ColorCode.green);
    }

    public green(text: string) : Mcli {
        return Mcli.green(text);
    }

    public static greenn(text: string) : Mcli {
        return Mcli.green(text).br();
    }

    public greenn(text: string) : Mcli {
        return Mcli.greenn(text);
    }

    public static yellow(text: string) : Mcli {
        return Mcli.outColor(text, ColorCode.yellow);
    }

    public yellow(text: string) : Mcli {
        return Mcli.yellow(text);
    }

    public static yellown(text: string) : Mcli {
        return Mcli.yellow(text).br();
    }

    public yellown(text: string) : Mcli {
        return Mcli.yellown(text);
    }

    public static magenta(text: string) : Mcli {
        return Mcli.outColor(text, ColorCode.magenta);
    }

    public magenta(text: string) : Mcli {
        return Mcli.magenta(text);
    }

    public static magentan(text: string) : Mcli {
        return Mcli.magenta(text).br();
    }

    public magentan(text: string) : Mcli {
        return Mcli.magentan(text);
    }

    public static cyan(text: string) : Mcli {
        return Mcli.outColor(text, ColorCode.cyan);
    }

    public cyan(text: string) : Mcli {
        return Mcli.cyan(text);
    }

    public static cyann(text: string) : Mcli {
        return Mcli.cyan(text).br();
    }

    public cyann(text: string) : Mcli {
        return Mcli.cyann(text);
    }

    public static in(text?: string, sepalateText? : string) : Promise<string> {

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

    public in(text? : string) : Promise<string> {
        return Mcli.in(text);
    }

    public static indent(setIndent: number) : Mcli {
        Mcli._indent = setIndent;
        return Mcli;
    }

    public indent(setIndent: number) : Mcli {
        return Mcli.indent(setIndent);
    }

    public static indentUp() : Mcli {
        Mcli._indent++;
        return Mcli;
    }

    public indentUp() : Mcli {
        return Mcli.indentUp();
    }

    public static indentDown() : Mcli {
        Mcli._indent--;
        return Mcli;
    }

    public indentDown() : Mcli {
        return Mcli.indentDown();
    }

    public static indentReset() : Mcli {
        Mcli._indent = 0;
        return Mcli;
    }

    public indentReset() : Mcli {
        return Mcli.indentReset();
    }
}
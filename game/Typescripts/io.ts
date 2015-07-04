declare var require;

module Musicope.IO {

    var fs = require("fs");
    var p = require('path');
    var gui = require('nw.gui');

    export function readBinaryFileAsString(path: string) {
        var def: JQueryDeferred<string> = $.Deferred();
        var data = fs.readFileSync(path);
        var str: string = String.fromCharCode.apply(null, new Uint8Array(data));
        def.resolve(str);
        return def;
    }

    export function readTextFile(path: string) {
        var def: JQueryDeferred<string> = $.Deferred();
        var text = fs.readFileSync(path, "utf-8");
        def.resolve(text);
        return def;
    }

    export function existsFile(path: string) {
        var def: JQueryDeferred<boolean> = $.Deferred();
        var fileExists = fs.existsSync(path);
        def.resolve(fileExists);
        return def;
    }

    export function writeTextFile(path: string, text: string) {
        fs.writeFile(path, text);
    }

    export function getAllFiles(path: string) {
        var files: { path: string; time: Date; }[] = [];
        fs.readdirSync(path).forEach((v) => {
            var path2: string = p.join(path, v);
            var stat = fs.lstatSync(path2);
            if (stat.isDirectory()) {
                var fls = getAllFiles(path2);
                files = files.concat(fls);
            } else {
                files.push({ path: path2, time: stat.birthtime });
            }
        });
        return files;
    }


} 
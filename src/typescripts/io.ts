declare var host;

module Musicope.IO {

    export function readBinaryFileAsString(path: string) {
        var def: JQueryDeferred<string> = $.Deferred();
        var data = host.fs.readFileSync(path);
        var str: string = String.fromCharCode.apply(null, new Uint8Array(data));
        def.resolve(str);
        return def;
    }

    export function readTextFile(path: string) {
        var def: JQueryDeferred<string> = $.Deferred(); 
        var text = host.fs.readFileSync(path, "utf-8");
        def.resolve(text);
        return def;
    }

    export function existsFile(path: string) {
        var def: JQueryDeferred<boolean> = $.Deferred();
        var fileExists = host.fs.existsSync(path);
        def.resolve(fileExists);
        return def;
    }

    export function writeTextFile(path: string, text: string) {
        host.fs.writeFile(path, text);
    }

    export function getAllFiles(path: string) {
        var files: { path: string; time: Date; }[] = [];
        host.fs.readdirSync(path).forEach((v) => {
            var path2: string = host.path.join(path, v);
            var stat = host.fs.lstatSync(path2);
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
declare var host;

module Musicope.IO {
    
    var _root: string = host.path.join(host.remote.app.getPath("documents"), "Musicope");

    export function readBinaryFileAsString(path: string, root = _root) {
        var def: JQueryDeferred<string> = $.Deferred();
        var data = host.fs.readFileSync(host.path.join(root, path));
        var str: string = String.fromCharCode.apply(null, new Uint8Array(data));
        def.resolve(str);
        return def;
    }

    export function readTextFile(path: string, root = _root) {
        var def: JQueryDeferred<string> = $.Deferred(); 
        var text = host.fs.readFileSync(host.path.join(root, path), "utf-8");
        def.resolve(text);
        return def;
    }

    export function existsFile(path: string, root = _root) {
        var def: JQueryDeferred<boolean> = $.Deferred();
        var fileExists = host.fs.existsSync(host.path.join(root, path));
        def.resolve(fileExists);
        return def;
    }

    export function writeTextFile(path: string, text: string, root = _root) {
        host.fs.writeFile(host.path.join(root, path), text);
    }

    export function getAllFiles(path: string, root = _root) {
        var files: { path: string; time: Date; }[] = [];
        host.fs.readdirSync(host.path.join(root, path)).forEach((v) => {
            var stat = host.fs.lstatSync(host.path.join(root, path, v));
            if (stat.isDirectory()) {
                var fls = getAllFiles(host.path.join(path, v));
                files = files.concat(fls);
            } else {
                files.push({
                    path: host.path.join(path, v),
                    time: stat.birthtime
                });
            }
        });
        return files;
    }


} 
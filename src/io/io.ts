declare var host;

export var songsJsonPath = "songs.json";
export var setupJsonPath = "setup.json";

var _root: string = host.path.join(host.remote.app.getPath("documents"), "Musicope");

export function readBinaryFileAsString(path: string, root = _root) {
    var data = host.fs.readFileSync(host.path.join(root, path));
    var str: string = String.fromCharCode.apply(null, new Uint8Array(data));
    return str;
}

export function readTextFile(path: string, root = _root) {
    var text: string = host.fs.readFileSync(host.path.join(root, path), "utf-8");
    return text;
}

export function existsFile(path: string, root = _root) {
    var fileExists: boolean = host.fs.existsSync(host.path.join(root, path));
    return fileExists;
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
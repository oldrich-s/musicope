declare var host;

export var scoresJsonPath = "scores.json";
export var setupJsonPath = "setup.json";

var root: string = host.path.join(host.remote.app.getPath("documents"), "Musicope");

function ensureDirectoryExistence(filePath: string) {
    var dirname = host.path.dirname(filePath);
    if (host.fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    host.fs.mkdirSync(dirname);
}

export function createDir(dirname: string) {
    var fullPath = host.path.join(root, dirname);
    host.fs.mkdirSync(fullPath);
}

export function readBinaryFileAsString(path: string) {
    var data = host.fs.readFileSync(host.path.join(root, path));
    var str: string = String.fromCharCode.apply(null, new Uint8Array(data));
    return str;
}

export function readTextFile(path: string) {
    var text: string = host.fs.readFileSync(host.path.join(root, path), "utf-8");
    return text;
}

export function existsPath(path: string) {
    var exists: boolean = host.fs.existsSync(host.path.join(root, path));
    return exists;
}

export function writeTextFile(path: string, text: string) {
    var fullPath = host.path.join(root, path);
    ensureDirectoryExistence(fullPath);
    host.fs.writeFileSync(fullPath, text);
}

export function getAllFiles(path: string) {
    var dirPath = host.path.join(root, path);
    var files: { path: string; time: Date; }[] = [];
    host.fs.readdirSync(dirPath).forEach((v) => {
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

export function copySongFiles(targetDirName: string) {
    var sourceDir = host.path.join(host.process.cwd(), "resources", "app", "example-songs");
    var targetDir = host.path.join(root, targetDirName);
    host.fs.readdirSync(sourceDir).forEach((v) => {
        var sourceFile = host.path.join(sourceDir, v);
        var targetFile = host.path.join(targetDir, v);
        var data = host.fs.readFileSync(sourceFile);
        host.fs.writeFileSync(targetFile, data);
    });
}
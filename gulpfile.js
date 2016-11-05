var gulp = require('gulp');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var ts = require('gulp-typescript');
var runSequence = require('run-sequence');
var rcedit = require('rcedit');
var exec = require('child_process').exec;
var sourcemaps = require('gulp-sourcemaps');

var buildRoot = 'build/';
var appRoot = buildRoot + 'resources/app/';

var vendorScriptFiles = [
    "node_modules/systemjs/dist/system.src.js",
    'node_modules/jquery/dist/jquery.js',
    'node_modules/framework7/dist/js/framework7.js',
    'node_modules/mousetrap/mousetrap.js',
    'node_modules/urijs/src/URI.js'
];

var vendorCSSFiles = [
    'node_modules/framework7/dist/css/framework7.ios.css',
    'node_modules/framework7/dist/css/framework7.ios.colors.css'
];

var tsProject = ts.createProject("tsconfig.json");

gulp.task('clean-app', function () {
    return gulp.src(appRoot).pipe(rimraf());
});

gulp.task('clean-build', function () {
    return gulp.src(buildRoot).pipe(rimraf());
});

gulp.task('vendor-scripts', function () {
    return gulp.src(vendorScriptFiles)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(appRoot));
});

gulp.task('vendor-css', function () {
    return gulp.src(vendorCSSFiles)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(appRoot));
});

gulp.task('static', function (done) {
    return gulp.src('src/static/**/*.*')
        .pipe(gulp.dest(appRoot));
});

gulp.task('ts', function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js.pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(appRoot))
});

gulp.task('copy-electron', function () {
    return gulp.src('node_modules/electron/dist/**/*')
        .pipe(gulp.dest(buildRoot));
});

gulp.task('rcedit', function (cb) {
    rcedit(buildRoot + "electron.exe", {
        "icon": "src/static/icon.ico"
    }, cb);
});

gulp.task('electron-install-npm', function (cb) {
    exec('cd build\\resources\\app && npm install', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('move-node_modules', function (cb) {
    exec('move build\\resources\\app\\node_modules build\\resources\\node_modules', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task("rename-electron", function (cb) {
    exec('ren build\\electron.exe musicope.exe', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('app', function () {
    return runSequence('clean-app', ['vendor-scripts', 'vendor-css', 'ts', 'static']);
});

gulp.task('default', function () {
    return runSequence('clean-build', 'app', 'copy-electron', 'rcedit', "rename-electron", 'electron-install-npm', 'move-node_modules');
});
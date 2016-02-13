var gulp = require('gulp');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var ts = require('gulp-typescript');
var runSequence = require('run-sequence');
var electron = require('gulp-atom-electron');

var base = 'build/web/';

var vendorScriptFiles = [
    'node_modules/jquery/dist/jquery.js',
    'node_modules/framework7/dist/js/framework7.js',
    'node_modules/mousetrap/mousetrap.js',
    'node_modules/urijs/src/URI.js',
    'src/vendor-scripts/**/*.js'
];

var vendorCSSFiles = [
    'node_modules/framework7/dist/css/framework7.ios.css',
    'node_modules/framework7/dist/css/framework7.ios.colors.css'
];

var tsFiles = [
    'typings/**/*.d.ts',
    'src/typescripts/**/*.ts'
];

var tsProject = ts.createProject({
    noExternalResolve: true,
    target: 'ES5'
});

var electronOptions = {
    version: '0.36.7',
    platform: 'win32',
    winIcon: './src/content/icon.ico'
};

gulp.task('clean', function () {
    return gulp.src(base).pipe(rimraf());
})

gulp.task('vendorScripts', function () {
    return gulp.src(vendorScriptFiles)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(base));
});

gulp.task('vendorCSS', function () {
    return gulp.src(vendorCSSFiles)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(base));
});

gulp.task('content', function (done) {
    return gulp.src('src/content/**/*.*')
        .pipe(gulp.dest(base));
});

gulp.task('ts', function () {
    return gulp.src(tsFiles)
        .pipe(ts(tsProject))
        .js.pipe(concat('app.js'))
        .pipe(gulp.dest(base))
});

gulp.task('copy', function () {
    return gulp.src('build/web/**').pipe(gulp.dest('build/app/resources/app/'));
});

gulp.task('electron', function () {
    return gulp.src('build/web/**')
        .pipe(electron(electronOptions))
        .pipe(gulp.dest('build/app'));
});

gulp.task('default', function () {
    return runSequence('clean', ['vendorScripts', 'vendorCSS', 'ts', 'content'], 'copy');
});
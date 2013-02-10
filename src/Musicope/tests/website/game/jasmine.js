define(["require", "exports"], function(require, exports) {
    /// <reference path="_references.ts" />
    function start() {
        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;
        var htmlReporter = new (jasmine).HtmlReporter();
        jasmineEnv.addReporter(htmlReporter);
        jasmineEnv.specFilter = function (spec) {
            return htmlReporter.specFilter(spec);
        };
        var currentWindowOnload = window.onload;
        window.onload = function () {
            if(currentWindowOnload) {
                currentWindowOnload(null);
            }
            execJasmine();
        };
        function execJasmine() {
            jasmineEnv.execute();
        }
    }
    exports.start = start;
})
//@ sourceMappingURL=jasmine.js.map

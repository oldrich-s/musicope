/// <reference path="_references.ts" />

export function start() {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;
  var htmlReporter = new (<any> jasmine).HtmlReporter();
  jasmineEnv.addReporter(htmlReporter);
  jasmineEnv.specFilter = function (spec) {
    return htmlReporter.specFilter(spec);
  };
  var currentWindowOnload = window.onload;
  window.onload = function () {
    if (currentWindowOnload) {
      currentWindowOnload(null);
    }
    execJasmine();
  };
  function execJasmine() {
    jasmineEnv.execute();
  }
}
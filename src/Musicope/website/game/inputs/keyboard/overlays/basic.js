define(["require", "exports"], function(require, exports) {
    /// <reference path="../../../_references.ts" />
    var displayDescription;
    var displayValue;
    var oldTimeOut;
    function createDomIfNeeded() {
        if(!displayDescription || !displayValue) {
            var container = $("<div />").appendTo('#overlayDiv');
            displayDescription = $("<span />").appendTo(container);
            displayValue = $("<span style='color:red;font-size:large;' />").appendTo(container);
        }
    }
    function display(description, value) {
        createDomIfNeeded();
        displayDescription.text(description + ": ");
        displayValue.text(value);
        clearTimeout(oldTimeOut);
        oldTimeOut = setTimeout(function () {
            displayDescription.text("");
            displayValue.text("");
        }, 5000);
    }
    exports.display = display;
})
//@ sourceMappingURL=basic.js.map

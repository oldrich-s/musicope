define(["require", "exports"], function(require, exports) {
    function areEqual(param1, param2) {
        if(typeof param1 === "object" && typeof param2 === "object" && "every" in param1 && "every" in param2) {
            var areEqual = (param1).every(function (param1i, i) {
                return param1i == param2[i];
            });
            return areEqual;
        } else {
            return param1 == param2;
        }
    }
    exports.areEqual = areEqual;
    function toggle(currentOption, options) {
        for(var i = 0; i < options.length; i++) {
            if(areEqual(currentOption, options[i])) {
                return options[(i + 1) % options.length];
            }
        }
    }
    exports.toggle = toggle;
})
//@ sourceMappingURL=_tools.js.map

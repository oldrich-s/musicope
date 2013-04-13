define(["require", "exports"], function(require, exports) {
    function get(name, defaultValue) {
        var val = localStorage.getItem(name);
        if(!val || val === "undefined") {
            return defaultValue;
        } else {
            try  {
                return JSON.parse(val);
            } catch (e) {
                return val;
            }
        }
    }
    exports.get = get;
    function set(name, value) {
        var val = JSON.stringify(value);
        localStorage.setItem(name, val);
    }
    exports.set = set;
})
//@ sourceMappingURL=services.local.js.map

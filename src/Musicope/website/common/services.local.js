var Musicope;
(function (Musicope) {
    (function (LocStorage) {
        function get(name, defaultValue) {
            var val = localStorage.getItem(name);
            if (!val || val === "undefined") {
                return defaultValue;
            } else {
                try  {
                    return JSON.parse(val);
                } catch (e) {
                    return val;
                }
            }
        }
        LocStorage.get = get;

        function set(name, value) {
            var val = JSON.stringify(value);
            localStorage.setItem(name, val);
        }
        LocStorage.set = set;
    })(Musicope.LocStorage || (Musicope.LocStorage = {}));
    var LocStorage = Musicope.LocStorage;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=services.local.js.map

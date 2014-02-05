var Musicope;
(function (Musicope) {
    (function (Params) {
        function getUrlParams(_default) {
            var params = $.url().param();
            var out = {};
            for (var name in _default) {
                if (name in params) {
                    try  {
                        out[name] = JSON.parse(params[name]);
                    } catch (e) {
                        out[name] = params[name];
                    }
                } else {
                    out[name] = _default[name];
                }
            }
            return out;
        }
        Params.getUrlParams = getUrlParams;
    })(Musicope.Params || (Musicope.Params = {}));
    var Params = Musicope.Params;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=services.params.js.map

define(["require", "exports"], function(require, exports) {
    /// <reference path="../_lib/purl/purl.d.ts" />
    function getUrlParams(_default) {
        var params = $.url().param();
        var out = {
        };
        for(var name in _default) {
            if(name in params) {
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
    exports.getUrlParams = getUrlParams;
})
//@ sourceMappingURL=services.params.js.map

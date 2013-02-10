define(["require", "exports", "./defaults", "../../../common/services.params"], function(require, exports, __defParams__, __paramService__) {
    /// <reference path="../../_references.ts" />
    var defParams = __defParams__;

    var paramService = __paramService__;

    var Basic = (function () {
        function Basic() {
            this.subscribtions = [];
            var o = this;
            o.readOnly = paramService.getUrlParams(defParams.params);
        }
        Basic.prototype.subscribe = function (regex, callback) {
            var o = this;
            o.subscribtions.push({
                regex: new RegExp(regex),
                callback: callback
            });
        };
        Basic.prototype.setParam = function (name, value, dontNotifyOthers) {
            var o = this;
            o.readOnly[name] = value;
            if(!dontNotifyOthers) {
                o.call(name, value);
            }
        };
        Basic.prototype.areEqual = function (param1, param2) {
            if("every" in param1 && "every" in param2) {
                var areEqual = (param1).every(function (param1i, i) {
                    return param1i == param2[i];
                });
                return areEqual;
            } else {
                return param1 == param2;
            }
        };
        Basic.prototype.call = function (param, value) {
            var o = this;
            o.subscribtions.forEach(function (s) {
                if(param.search(s.regex) > -1) {
                    s.callback(param, value);
                }
            });
        };
        return Basic;
    })();
    exports.Basic = Basic;    
})
//@ sourceMappingURL=_main.js.map

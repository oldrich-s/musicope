var Musicope;
(function (Musicope) {
    (function (Params) {
        (function (_Basic) {
            var Basic = (function () {
                function Basic() {
                    this.subscriptions = {};
                    var o = this;
                    o.readOnly = Musicope.Params.getUrlParams(Musicope.Params._Basic.defParams);
                }
                Basic.prototype.subscribe = function (id, regex, callback) {
                    var o = this;
                    o.subscriptions[id] = {
                        regex: new RegExp(regex),
                        callback: callback
                    };
                };

                Basic.prototype.unsubscribe = function (id) {
                    var o = this;
                    delete o.subscriptions[id];
                };

                Basic.prototype.setParam = function (name, value, dontNotifyOthers) {
                    var o = this;
                    o.readOnly[name] = value;
                    if (!dontNotifyOthers) {
                        o.call(name, value);
                    }
                };

                Basic.prototype.areEqual = function (param1, param2) {
                    if ("every" in param1 && "every" in param2) {
                        var areEqual = param1.every(function (param1i, i) {
                            return param1i == param2[i];
                        });
                        return areEqual;
                    } else {
                        return param1 == param2;
                    }
                };

                Basic.prototype.call = function (param, value) {
                    var o = this;
                    for (var prop in o.subscriptions) {
                        var s = o.subscriptions[prop];
                        if (param.search(s["regex"]) > -1) {
                            s["callback"](param, value);
                        }
                    }
                };
                return Basic;
            })();
            _Basic.Basic = Basic;
        })(Params.Basic || (Params.Basic = {}));
        var Basic = Params.Basic;
    })(Musicope.Params || (Musicope.Params = {}));
    var Params = Musicope.Params;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=_main.js.map

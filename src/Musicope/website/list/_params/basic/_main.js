var Musicope;
(function (Musicope) {
    (function (List) {
        (function (Params) {
            var Basic = (function () {
                function Basic() {
                    this.subscribtions = [];
                    var o = this;
                    o.readOnly = Musicope.Params.getUrlParams(Musicope.List.Params.BasicFns.defParams);
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
                    o.subscribtions.forEach(function (s) {
                        if (param.search(s.regex) > -1) {
                            s.callback(param, value);
                        }
                    });
                };
                return Basic;
            })();
            Params.Basic = Basic;
        })(List.Params || (List.Params = {}));
        var Params = List.Params;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=_main.js.map

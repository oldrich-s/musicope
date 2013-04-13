define(["require", "exports", "./actions/_load"], function(require, exports, __actionsM__) {
    /// <reference path="../../_references.ts" />
    var actionsM = __actionsM__;

    var Basic = (function () {
        function Basic(params) {
            this.params = params;
            this.actions = [];
            var o = this;
            o.contr = params.controller;
            o.pushActions();
            o.sortActions();
        }
        Basic.prototype.pushActions = function () {
            var o = this;
            var params = {
                inputParams: o.params
            };
            for(var prop in actionsM) {
                var constr = actionsM[prop];
                o.actions.push(new constr(params));
            }
        };
        Basic.prototype.sortActions = function () {
            var o = this;
            o.actions.sort(function (a, b) {
                return a.priority > b.priority;
            });
        };
        Basic.prototype.onQueryUpdate = function (query) {
            var o = this;
            o.actions.forEach(function (action) {
                var pos = query.search(action.regexp);
                if(pos !== -1) {
                    action.onQueryUpdate(query);
                }
            });
        };
        Basic.prototype.onRedirect = function (displayedSongsIndex) {
            var o = this;
            var promises = [];
            o.actions.forEach(function (action) {
                if(action.onRedirect) {
                    promises.push(action.onRedirect(displayedSongsIndex));
                }
            });
            return $.when.apply(null, promises);
        };
        return Basic;
    })();
    exports.Basic = Basic;    
})
//@ sourceMappingURL=_main.js.map

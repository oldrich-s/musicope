define(["require", "exports", "./actions/_load"], function(require, exports, __actionsM__) {
    /// <reference path="../../_references.ts" />
    var actionsM = __actionsM__;

    var Keyboard = (function () {
        function Keyboard(params) {
            this.params = params;
            this.actions = [];
            var o = this;
            o.initActions();
            o.signupActions();
        }
        Keyboard.prototype.initActions = function () {
            var o = this;
            var keyboardParams = {
                inputParams: o.params
            };
            for(var prop in actionsM) {
                var action = new (actionsM[prop])(keyboardParams);
                o.actions.push(action);
            }
        };
        Keyboard.prototype.signupActions = function () {
            var o = this;
            $(document).keydown(function (e) {
                o.analyzePressedKeys(e);
            });
        };
        Keyboard.prototype.analyzePressedKeys = function (e) {
            var o = this;
            for(var i = 0; i < o.actions.length; i++) {
                if(o.doActionKeysMatch(o.actions[i], e)) {
                    o.actions[i].triggerAction();
                    e.preventDefault();
                    return;
                }
            }
        };
        Keyboard.prototype.doActionKeysMatch = function (action, e) {
            var sameKeys = action.key === e.which;
            var sameAlt = (!action.isAlt && !e["altKey"]) || (action.isAlt && e["altKey"]);
            var sameCtrl = (!action.isCtrl && !e["ctrlKey"]) || (action.isCtrl && e["ctrlKey"]);
            var sameShift = (!action.isShift && !e["shiftKey"]) || (action.isShift && e["shiftKey"]);
            return sameKeys && sameAlt && sameCtrl && sameShift;
        };
        return Keyboard;
    })();
    exports.Keyboard = Keyboard;    
})
//@ sourceMappingURL=_main.js.map

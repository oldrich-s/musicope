define(["require", "exports", "./actions/_load", "./overlays/_load"], function(require, exports, __actionsM__, __overlaysM__) {
    /// <reference path="../../_references.ts" />
    var actionsM = __actionsM__;

    var overlaysM = __overlaysM__;

    var Keyboard = (function () {
        function Keyboard(params, song) {
            this.params = params;
            this.song = song;
            this.actions = [];
            var o = this;
            o.initActions();
            o.checkActionsDuplicates();
            o.signupActions();
        }
        Keyboard.prototype.initActions = function () {
            var o = this;
            var deff = $.Deferred();
            var keyboardParams = {
                params: o.params,
                song: o.song,
                actions: deff.promise()
            };
            for(var prop in actionsM) {
                var action = new (actionsM[prop])(keyboardParams);
                o.actions.push(action);
            }
            deff.resolve(o.actions);
        };
        Keyboard.prototype.checkActionsDuplicates = function () {
            var o = this;
            var keys = {
            };
            o.actions.forEach(function (action) {
                if(keys[action.key]) {
                    var text = "duplicate keys: '" + keys[action.key] + "' vs '" + action.id + "'";
                    throw text;
                }
                keys[action.key] = action.id;
            });
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
                var match = o.doActionKeysMatch(o.actions[i], e);
                if(match) {
                    o.actions[i].triggerAction();
                    overlaysM.basic.display(o.actions[i].id, o.actions[i].getCurrentState());
                    return;
                }
            }
        };
        Keyboard.prototype.doActionKeysMatch = function (action, e) {
            var sameKeys = action.key === e.which;
            return sameKeys;
        };
        return Keyboard;
    })();
    exports.Keyboard = Keyboard;    
})
//@ sourceMappingURL=_main.js.map

define(["require", "exports", "./actions/_load"], function(require, exports, __actions__) {
    /// <reference path="../../_references.ts" />
    var actions = __actions__;

    var Keyboard = (function () {
        function Keyboard(params, parser) {
            this.params = params;
            this.parser = parser;
            this.actionObjects = [];
            var o = this;
            o.initActions();
            o.signupActions();
        }
        Keyboard.prototype.initActions = function () {
            var o = this;
            for(var prop in actions) {
                var action = new (actions[prop])(o.params, o.parser);
                o.actionObjects.push(action);
            }
        };
        Keyboard.prototype.signupActions = function () {
            var o = this;
            $(document).keydown(function (e) {
                o.actionObjects.forEach(function (action) {
                    var isValid = action.hotkeys.some(function (key) {
                        return key == e.which;
                    });
                    if(isValid) {
                        action.keyPressed(e.which);
                    }
                });
            });
        };
        return Keyboard;
    })();
    exports.Keyboard = Keyboard;    
})
//@ sourceMappingURL=_main.js.map

define(["require", "exports", "../../../../common/keyCodes", "../overlays/_load"], function(require, exports, __key__, __overlays__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var overlays = __overlays__;

    var Hands = (function () {
        function Hands(params, parser) {
            this.params = params;
            this.parser = parser;
            this.hotkeys = [
                key.w, 
                key.h
            ];
            var o = this;
        }
        Hands.prototype.keyPressed = function (keyCode) {
            var o = this;
            if(keyCode == key.w) {
                o.toggleWait();
            } else if(keyCode == key.h) {
                o.toggleHands();
            }
        };
        Hands.prototype.toggleWait = function () {
            var o = this;
            var options = [
                [
                    false, 
                    false
                ], 
                [
                    true, 
                    true
                ]
            ];
            o.params.setParam("p_waits", o.toggle(o.params.readOnly.p_waits, options));
            overlays.basic.display("p_waits", JSON.stringify(o.params.readOnly.p_waits));
        };
        Hands.prototype.toggleHands = function () {
            var o = this;
            var options = [
                [
                    false, 
                    false
                ], 
                [
                    false, 
                    true
                ], 
                [
                    true, 
                    false
                ], 
                [
                    true, 
                    true
                ]
            ];
            o.params.setParam("p_userHands", o.toggle(o.params.readOnly.p_userHands, options));
            overlays.basic.display("User plays", JSON.stringify(o.params.readOnly.p_userHands));
        };
        Hands.prototype.toggle = function (currentOption, options) {
            var o = this;
            for(var i = 0; i < options.length; i++) {
                if(o.params.areEqual(currentOption, options[i])) {
                    return options[(i + 1) % options.length];
                }
            }
        };
        return Hands;
    })();
    exports.Hands = Hands;    
})
//@ sourceMappingURL=hands.js.map

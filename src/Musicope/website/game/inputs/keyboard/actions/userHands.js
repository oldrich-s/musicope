define(["require", "exports", "../../../../common/keyCodes", "./_tools"], function(require, exports, __key__, __toolsM__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var toolsM = __toolsM__;

    var userHands = (function () {
        function userHands(p) {
            this.p = p;
            this.id = "user hands";
            this.description = "toggle which hands the user plays.";
            this.key = key.h;
            this.options = [
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
            this.names = [
                "none", 
                "right", 
                "left", 
                "both"
            ];
        }
        userHands.prototype.triggerAction = function () {
            var o = this;
            o.p.params.setParam("p_userHands", toolsM.toggle(o.p.params.readOnly.p_userHands, o.options));
        };
        userHands.prototype.getCurrentState = function () {
            var o = this;
            var i = o.options.indexOf(o.p.params.readOnly.p_userHands);
            return o.names[i];
        };
        return userHands;
    })();
    exports.userHands = userHands;    
})
//@ sourceMappingURL=userHands.js.map

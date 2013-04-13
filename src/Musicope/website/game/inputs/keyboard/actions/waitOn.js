define(["require", "exports", "../../../../common/keyCodes", "./_tools"], function(require, exports, __key__, __toolsM__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var toolsM = __toolsM__;

    var waitOn = (function () {
        function waitOn(p) {
            this.p = p;
            this.id = "wait";
            this.description = "shall the song wait for the user?";
            this.key = key.w;
            this.options = [
                [
                    false, 
                    false
                ], 
                [
                    true, 
                    true
                ]
            ];
            this.names = [
                "off", 
                "on"
            ];
        }
        waitOn.prototype.triggerAction = function () {
            var o = this;
            o.p.params.setParam("p_waits", toolsM.toggle(o.p.params.readOnly.p_waits, o.options));
        };
        waitOn.prototype.getCurrentState = function () {
            var o = this;
            var i = o.options.indexOf(o.p.params.readOnly.p_waits);
            return o.names[i];
        };
        return waitOn;
    })();
    exports.waitOn = waitOn;    
})
//@ sourceMappingURL=waitOn.js.map

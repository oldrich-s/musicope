define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var pauseOn = (function () {
        function pauseOn(p) {
            this.p = p;
            this.id = "pause";
            this.description = "pause and unpause the game";
            this.key = key.space;
        }
        pauseOn.prototype.triggerAction = function () {
            var o = this;
            o.p.params.setParam("p_isPaused", !o.p.params.readOnly.p_isPaused);
        };
        pauseOn.prototype.getCurrentState = function () {
            var o = this;
            return o.p.params.readOnly.p_isPaused ? "on" : "off";
        };
        return pauseOn;
    })();
    exports.pauseOn = pauseOn;    
})
//@ sourceMappingURL=pauseOn.js.map

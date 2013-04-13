define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var speedUp = (function () {
        function speedUp(p) {
            this.p = p;
            this.id = "speed up";
            this.description = "speed up the song by 10%";
            this.key = key.upArrow;
        }
        speedUp.prototype.triggerAction = function () {
            var o = this;
            o.p.params.setParam("p_speed", o.p.params.readOnly.p_speed + 0.1);
        };
        speedUp.prototype.getCurrentState = function () {
            var o = this;
            return o.p.params.readOnly.p_speed * 100;
        };
        return speedUp;
    })();
    exports.speedUp = speedUp;    
})
//@ sourceMappingURL=speedUp.js.map

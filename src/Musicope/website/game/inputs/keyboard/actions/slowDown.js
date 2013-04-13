define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var slowDown = (function () {
        function slowDown(p) {
            this.p = p;
            this.id = "slow down";
            this.description = "slow down the song by 10%";
            this.key = key.downArrow;
        }
        slowDown.prototype.triggerAction = function () {
            var o = this;
            o.p.params.setParam("p_speed", o.p.params.readOnly.p_speed - 0.1);
        };
        slowDown.prototype.getCurrentState = function () {
            var o = this;
            return o.p.params.readOnly.p_speed * 100;
        };
        return slowDown;
    })();
    exports.slowDown = slowDown;    
})
//@ sourceMappingURL=slowDown.js.map

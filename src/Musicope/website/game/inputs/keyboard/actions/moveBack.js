define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var moveBack = (function () {
        function moveBack(p) {
            this.p = p;
            this.id = "move back";
            this.description = "move back by the amount of 2 beats";
            this.key = key.leftArrow;
        }
        moveBack.prototype.triggerAction = function () {
            var o = this;
            var newTime = o.p.params.readOnly.p_elapsedTime - 2 * o.p.song.timePerBeat;
            var truncTime = Math.max(o.p.params.readOnly.p_initTime, newTime);
            o.p.params.setParam("p_elapsedTime", truncTime);
        };
        moveBack.prototype.getCurrentState = function () {
            var o = this;
            return o.p.params.readOnly.p_elapsedTime / 1000;
        };
        return moveBack;
    })();
    exports.moveBack = moveBack;    
})
//@ sourceMappingURL=moveBack.js.map

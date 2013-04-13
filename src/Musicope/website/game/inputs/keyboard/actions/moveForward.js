define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var moveForward = (function () {
        function moveForward(p) {
            this.p = p;
            this.id = "move forward";
            this.description = "move forward by the amount of 2 beats";
            this.key = key.rightArrow;
        }
        moveForward.prototype.triggerAction = function () {
            var o = this;
            var newTime = o.p.params.readOnly.p_elapsedTime + 2 * o.p.song.timePerBeat;
            var truncTime = Math.min(o.p.song.timePerSong + 10, newTime);
            o.p.params.setParam("p_elapsedTime", truncTime);
        };
        moveForward.prototype.getCurrentState = function () {
            var o = this;
            return o.p.params.readOnly.p_elapsedTime / 1000;
        };
        return moveForward;
    })();
    exports.moveForward = moveForward;    
})
//@ sourceMappingURL=moveForward.js.map

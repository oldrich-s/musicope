define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var MoveInTime = (function () {
        function MoveInTime(params, parser) {
            this.params = params;
            this.parser = parser;
            this.hotkeys = [
                key.leftArrow, 
                key.rightArrow, 
                key.home
            ];
        }
        MoveInTime.prototype.keyPressed = function (keyCode) {
            var o = this;
            if(keyCode == key.leftArrow) {
                o.moveBack();
            } else if(keyCode == key.rightArrow) {
                o.moveForward();
            } else if(keyCode == key.home) {
                o.goHome();
            }
        };
        MoveInTime.prototype.moveBack = function () {
            var o = this;
            var newTime = o.params.readOnly.p_elapsedTime - 2 * o.parser.timePerBeat;
            var truncTime = Math.max(o.params.readOnly.p_initTime, newTime);
            o.params.setParam("p_elapsedTime", truncTime);
        };
        MoveInTime.prototype.moveForward = function () {
            var o = this;
            var newTime = o.params.readOnly.p_elapsedTime + 2 * o.parser.timePerBeat;
            var truncTime = Math.min(o.parser.timePerSong + 10, newTime);
            o.params.setParam("p_elapsedTime", truncTime);
        };
        MoveInTime.prototype.goHome = function () {
            var o = this;
            o.params.setParam("p_elapsedTime", o.params.readOnly.p_initTime);
        };
        return MoveInTime;
    })();
    exports.MoveInTime = MoveInTime;    
})
//@ sourceMappingURL=moveInTime.js.map

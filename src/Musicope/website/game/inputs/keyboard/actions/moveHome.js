define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var moveHome = (function () {
        function moveHome(p) {
            this.p = p;
            this.id = "move home";
            this.description = "move to the initial state of the song";
            this.key = key.home;
        }
        moveHome.prototype.triggerAction = function () {
            var o = this;
            o.p.params.setParam("p_elapsedTime", o.p.params.readOnly.p_initTime);
        };
        moveHome.prototype.getCurrentState = function () {
            var o = this;
            return o.p.params.readOnly.p_elapsedTime / 1000;
        };
        return moveHome;
    })();
    exports.moveHome = moveHome;    
})
//@ sourceMappingURL=moveHome.js.map

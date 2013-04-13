define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var stepDown = (function () {
        function stepDown(p) {
            this.id = "step down";
            this.description = "";
            this.key = key.downArrow;
            var o = this;
            o.contr = p.inputParams.controller;
        }
        stepDown.prototype.triggerAction = function () {
            var o = this;
            var index = o.contr.listIndex() + 1;
            var length = o.contr.displayedSongs().length;
            var trimmedIndex = index >= length ? length - 1 : index;
            o.contr.listIndex(trimmedIndex);
        };
        stepDown.prototype.getCurrentState = function () {
            var o = this;
            return 0;
        };
        return stepDown;
    })();
    exports.stepDown = stepDown;    
})
//@ sourceMappingURL=stepDown.js.map

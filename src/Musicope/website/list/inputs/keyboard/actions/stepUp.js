define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var stepUp = (function () {
        function stepUp(p) {
            this.id = "step up";
            this.description = "";
            this.key = key.upArrow;
            var o = this;
            o.contr = p.inputParams.controller;
        }
        stepUp.prototype.triggerAction = function () {
            var o = this;
            var index = o.contr.listIndex() - 1;
            var trimmedIndex = index < 0 ? 0 : index;
            o.contr.listIndex(trimmedIndex);
        };
        stepUp.prototype.getCurrentState = function () {
            var o = this;
            return 0;
        };
        return stepUp;
    })();
    exports.stepUp = stepUp;    
})
//@ sourceMappingURL=stepUp.js.map

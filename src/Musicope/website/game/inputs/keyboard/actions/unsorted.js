define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var Unsorted = (function () {
        function Unsorted(params, parser) {
            this.params = params;
            this.parser = parser;
            this.hotkeys = [
                key.space
            ];
        }
        Unsorted.prototype.keyPressed = function (keyCode) {
            var o = this;
            if(keyCode == key.space) {
                o.togglePause();
            }
        };
        Unsorted.prototype.togglePause = function () {
            var o = this;
            o.params.setParam("p_isPaused", !o.params.readOnly.p_isPaused);
        };
        return Unsorted;
    })();
    exports.Unsorted = Unsorted;    
})
//@ sourceMappingURL=unsorted.js.map

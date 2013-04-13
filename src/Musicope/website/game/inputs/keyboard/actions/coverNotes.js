define(["require", "exports", "../../../../common/keyCodes", "./_tools"], function(require, exports, __key__, __toolsM__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var toolsM = __toolsM__;

    var coverNotes = (function () {
        function coverNotes(p) {
            this.p = p;
            this.id = "cover notes";
            this.description = "Cover notes";
            this.key = key.c;
            this.states = [
                0.0, 
                0.2, 
                0.4, 
                0.6, 
                0.8
            ];
        }
        coverNotes.prototype.triggerAction = function () {
            var o = this;
            var height = toolsM.toggle(o.p.params.readOnly.s_noteCoverRelHeight, o.states);
            o.p.params.setParam("s_noteCoverRelHeight", height);
        };
        coverNotes.prototype.getCurrentState = function () {
            var o = this;
            return o.p.params.readOnly.s_noteCoverRelHeight;
        };
        return coverNotes;
    })();
    exports.coverNotes = coverNotes;    
})
//@ sourceMappingURL=coverNotes.js.map

define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var voteUp = (function () {
        function voteUp(p) {
            this.id = "vote up";
            this.description = "";
            this.key = key.upArrow;
            this.isCtrl = true;
            var o = this;
            o.contr = p.inputParams.controller;
        }
        voteUp.prototype.triggerAction = function () {
            var o = this;
            var song = o.contr.displayedSongs()[o.contr.listIndex()];
            song.db["votes"](song.db["votes"]() + 1);
        };
        voteUp.prototype.getCurrentState = function () {
            var o = this;
            return 0;
        };
        return voteUp;
    })();
    exports.voteUp = voteUp;    
})
//@ sourceMappingURL=voteUp.js.map

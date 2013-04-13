define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var voteDown = (function () {
        function voteDown(p) {
            this.id = "vote down";
            this.description = "";
            this.key = key.downArrow;
            this.isCtrl = true;
            var o = this;
            o.contr = p.inputParams.controller;
        }
        voteDown.prototype.triggerAction = function () {
            var o = this;
            var song = o.contr.displayedSongs()[o.contr.listIndex()];
            song.db["votes"](song.db["votes"]() - 1);
        };
        voteDown.prototype.getCurrentState = function () {
            var o = this;
            return 0;
        };
        return voteDown;
    })();
    exports.voteDown = voteDown;    
})
//@ sourceMappingURL=voteDown.js.map

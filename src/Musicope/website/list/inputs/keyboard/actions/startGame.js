define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var startGame = (function () {
        function startGame(p) {
            this.id = "start game";
            this.description = "";
            this.key = key.enter;
            var o = this;
            o.contr = p.inputParams.controller;
        }
        startGame.prototype.triggerAction = function () {
            var o = this;
            var song = o.contr.displayedSongs()[o.contr.listIndex()];
            o.contr.redirect(o.contr.listIndex, song);
        };
        startGame.prototype.getCurrentState = function () {
            var o = this;
            return 0;
        };
        return startGame;
    })();
    exports.startGame = startGame;    
})
//@ sourceMappingURL=startGame.js.map

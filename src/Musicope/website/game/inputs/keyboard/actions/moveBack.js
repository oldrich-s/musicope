var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    var MoveBack = (function () {
                        function MoveBack(p) {
                            this.p = p;
                            this.id = "move back";
                            this.description = "move back by the amount of 2 beats";
                            this.key = Musicope.KeyCodes.leftArrow;
                        }
                        MoveBack.prototype.triggerAction = function () {
                            var o = this;
                            var newTime = o.p.params.readOnly.p_elapsedTime - 2 * o.p.song.timePerBeat;
                            var truncTime = Math.max(o.p.params.readOnly.p_initTime, newTime);
                            o.p.params.setParam("p_elapsedTime", truncTime);
                        };

                        MoveBack.prototype.getCurrentState = function () {
                            var o = this;
                            return o.p.params.readOnly.p_elapsedTime / 1000;
                        };
                        return MoveBack;
                    })();
                    Actions.MoveBack = MoveBack;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=moveBack.js.map

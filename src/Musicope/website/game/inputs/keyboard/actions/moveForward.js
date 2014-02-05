var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    var MoveForward = (function () {
                        function MoveForward(p) {
                            this.p = p;
                            this.id = "move forward";
                            this.description = "move forward by the amount of 2 beats";
                            this.key = Musicope.KeyCodes.rightArrow;
                        }
                        MoveForward.prototype.triggerAction = function () {
                            var o = this;
                            var newTime = o.p.params.readOnly.p_elapsedTime + 2 * o.p.song.timePerBeat;
                            var truncTime = Math.min(o.p.song.timePerSong + 10, newTime);
                            o.p.params.setParam("p_elapsedTime", truncTime);
                        };

                        MoveForward.prototype.getCurrentState = function () {
                            var o = this;
                            return o.p.params.readOnly.p_elapsedTime / 1000;
                        };
                        return MoveForward;
                    })();
                    Actions.MoveForward = MoveForward;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=moveForward.js.map

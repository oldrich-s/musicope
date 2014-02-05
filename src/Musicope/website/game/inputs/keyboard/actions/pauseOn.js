var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    var PauseOn = (function () {
                        function PauseOn(p) {
                            this.p = p;
                            this.id = "pause";
                            this.description = "pause and unpause the game";
                            this.key = Musicope.KeyCodes.space;
                        }
                        PauseOn.prototype.triggerAction = function () {
                            var o = this;
                            o.p.params.setParam("p_isPaused", !o.p.params.readOnly.p_isPaused);
                        };

                        PauseOn.prototype.getCurrentState = function () {
                            var o = this;
                            return o.p.params.readOnly.p_isPaused ? "on" : "off";
                        };
                        return PauseOn;
                    })();
                    Actions.PauseOn = PauseOn;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=pauseOn.js.map

var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    var SpeedUp = (function () {
                        function SpeedUp(p) {
                            this.p = p;
                            this.id = "speed up";
                            this.description = "speed up the song by 10%";
                            this.key = Musicope.KeyCodes.upArrow;
                        }
                        SpeedUp.prototype.triggerAction = function () {
                            var o = this;
                            o.p.params.setParam("p_speed", o.p.params.readOnly.p_speed + 0.1);
                        };

                        SpeedUp.prototype.getCurrentState = function () {
                            var o = this;
                            return o.p.params.readOnly.p_speed * 100;
                        };
                        return SpeedUp;
                    })();
                    Actions.SpeedUp = SpeedUp;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=speedUp.js.map

var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    var SlowDown = (function () {
                        function SlowDown(p) {
                            this.p = p;
                            this.id = "slow down";
                            this.description = "slow down the song by 10%";
                            this.key = Musicope.KeyCodes.downArrow;
                        }
                        SlowDown.prototype.triggerAction = function () {
                            var o = this;
                            o.p.params.setParam("p_speed", o.p.params.readOnly.p_speed - 0.1);
                        };

                        SlowDown.prototype.getCurrentState = function () {
                            var o = this;
                            return o.p.params.readOnly.p_speed * 100;
                        };
                        return SlowDown;
                    })();
                    Actions.SlowDown = SlowDown;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=slowDown.js.map

var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    var MoveHome = (function () {
                        function MoveHome(p) {
                            this.p = p;
                            this.id = "move home";
                            this.description = "move to the initial state of the song";
                            this.key = Musicope.KeyCodes.home;
                        }
                        MoveHome.prototype.triggerAction = function () {
                            var o = this;
                            o.p.params.setParam("p_elapsedTime", o.p.params.readOnly.p_initTime);
                        };

                        MoveHome.prototype.getCurrentState = function () {
                            var o = this;
                            return o.p.params.readOnly.p_elapsedTime / 1000;
                        };
                        return MoveHome;
                    })();
                    Actions.MoveHome = MoveHome;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=moveHome.js.map

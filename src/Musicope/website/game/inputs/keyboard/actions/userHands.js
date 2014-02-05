var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    var UserHands = (function () {
                        function UserHands(p) {
                            this.p = p;
                            this.id = "user hands";
                            this.description = "toggle which hands the user plays.";
                            this.key = Musicope.KeyCodes.h;
                            this.options = [[false, false], [false, true], [true, false], [true, true]];
                            this.names = ["none", "right", "left", "both"];
                        }
                        UserHands.prototype.triggerAction = function () {
                            var o = this;
                            o.p.params.setParam("p_userHands", Musicope.Game.Inputs.KeyboardFns.Actions.Tools.toggle(o.p.params.readOnly.p_userHands, o.options));
                        };

                        UserHands.prototype.getCurrentState = function () {
                            var o = this;
                            var i = o.options.indexOf(o.p.params.readOnly.p_userHands);
                            return o.names[i];
                        };
                        return UserHands;
                    })();
                    Actions.UserHands = UserHands;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=userHands.js.map

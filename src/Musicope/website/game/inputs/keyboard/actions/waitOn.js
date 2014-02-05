var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    var WaitOn = (function () {
                        function WaitOn(p) {
                            this.p = p;
                            this.id = "wait";
                            this.description = "shall the song wait for the user?";
                            this.key = Musicope.KeyCodes.w;
                            this.options = [[false, false], [true, true]];
                            this.names = ["off", "on"];
                        }
                        WaitOn.prototype.triggerAction = function () {
                            var o = this;
                            o.p.params.setParam("p_waits", Musicope.Game.Inputs.KeyboardFns.Actions.Tools.toggle(o.p.params.readOnly.p_waits, o.options));
                        };

                        WaitOn.prototype.getCurrentState = function () {
                            var o = this;
                            var i = o.options.indexOf(o.p.params.readOnly.p_waits);
                            return o.names[i];
                        };
                        return WaitOn;
                    })();
                    Actions.WaitOn = WaitOn;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=waitOn.js.map

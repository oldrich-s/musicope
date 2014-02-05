var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    var MetronomeOn = (function () {
                        function MetronomeOn(p) {
                            this.p = p;
                            this.id = "metronome";
                            this.description = "toggle state of the metronome on/off";
                            this.key = Musicope.KeyCodes.m;
                        }
                        MetronomeOn.prototype.triggerAction = function () {
                            var o = this;
                            o.p.params.setParam("m_isOn", !o.p.params.readOnly.m_isOn);
                        };

                        MetronomeOn.prototype.getCurrentState = function () {
                            var o = this;
                            return o.p.params.readOnly.m_isOn ? "on" : "off";
                        };
                        return MetronomeOn;
                    })();
                    Actions.MetronomeOn = MetronomeOn;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=metronomeOn.js.map

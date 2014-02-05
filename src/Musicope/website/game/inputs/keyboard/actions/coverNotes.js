var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    var CoverNotes = (function () {
                        function CoverNotes(p) {
                            this.p = p;
                            this.id = "cover notes";
                            this.description = "Cover notes";
                            this.key = Musicope.KeyCodes.c;
                            this.states = [0.0, 0.2, 0.4, 0.6, 0.8];
                        }
                        CoverNotes.prototype.triggerAction = function () {
                            var o = this;
                            var height = Musicope.Game.Inputs.KeyboardFns.Actions.Tools.toggle(o.p.params.readOnly.s_noteCoverRelHeight, o.states);
                            o.p.params.setParam("s_noteCoverRelHeight", height);
                        };

                        CoverNotes.prototype.getCurrentState = function () {
                            var o = this;
                            return o.p.params.readOnly.s_noteCoverRelHeight;
                        };
                        return CoverNotes;
                    })();
                    Actions.CoverNotes = CoverNotes;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=coverNotes.js.map

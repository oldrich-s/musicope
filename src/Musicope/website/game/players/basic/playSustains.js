var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Players) {
            (function (BasicFns) {
                var o;

                var PlaySustains = (function () {
                    function PlaySustains(device, params, sustainNotes) {
                        this.device = device;
                        this.params = params;
                        this.sustainNotes = sustainNotes;
                        this.id = 0;
                        o = this;
                    }
                    PlaySustains.prototype.play = function () {
                        while (o.isIdBelowCurrentTime()) {
                            o.playSustainNote(o.sustainNotes[o.id]);
                            o.id++;
                        }
                    };

                    PlaySustains.prototype.isIdBelowCurrentTime = function () {
                        return o.sustainNotes[o.id] && o.sustainNotes[o.id].time < o.params.readOnly.p_elapsedTime;
                    };

                    PlaySustains.prototype.playSustainNote = function (note) {
                        if (o.params.readOnly.p_sustain) {
                            if (note.on) {
                                o.device.out(176, 64, 127);
                            } else {
                                o.device.out(176, 64, 0);
                            }
                        }
                    };
                    return PlaySustains;
                })();
                BasicFns.PlaySustains = PlaySustains;
            })(Players.BasicFns || (Players.BasicFns = {}));
            var BasicFns = Players.BasicFns;
        })(Game.Players || (Game.Players = {}));
        var Players = Game.Players;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=playSustains.js.map

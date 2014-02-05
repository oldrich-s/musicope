var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Players) {
            (function (BasicFns) {
                var o;

                var PlayNotes = (function () {
                    function PlayNotes(device, scene, params, notes) {
                        this.device = device;
                        this.scene = scene;
                        this.params = params;
                        this.notes = notes;
                        o = this;
                        o.assignIds();
                    }
                    PlayNotes.prototype.play = function () {
                        for (var trackId = 0; trackId < o.notes.length; trackId++) {
                            while (o.isIdBelowCurrentTime(trackId)) {
                                var note = o.notes[trackId][o.ids[trackId]];
                                o.playNote(note, trackId);
                                o.ids[trackId]++;
                            }
                        }
                    };

                    PlayNotes.prototype.reset = function (idsBelowCurrentTime) {
                        for (var i = 0; i < idsBelowCurrentTime.length; i++) {
                            o.ids[i] = Math.max(0, idsBelowCurrentTime[i]);
                        }
                    };

                    PlayNotes.prototype.assignIds = function () {
                        o.ids = o.notes.map(function () {
                            return 0;
                        });
                    };

                    PlayNotes.prototype.isIdBelowCurrentTime = function (trackId) {
                        return o.notes[trackId][o.ids[trackId]] && o.notes[trackId][o.ids[trackId]].time < o.params.readOnly.p_elapsedTime;
                    };

                    PlayNotes.prototype.playNote = function (note, trackId) {
                        var playsUser = o.params.readOnly.p_userHands[trackId];
                        if (!playsUser || o.playOutOfReach(note)) {
                            if (note.on) {
                                o.device.out(144, note.id, Math.min(127, o.getVelocity(trackId, note)));
                                o.scene.setActiveId(note.id);
                            } else {
                                o.device.out(144, note.id, 0);
                                o.scene.unsetActiveId(note.id);
                            }
                        }
                    };

                    PlayNotes.prototype.playOutOfReach = function (note) {
                        var isBelowMin = note.id < o.params.readOnly.p_minNote;
                        var isAboveMax = note.id > o.params.readOnly.p_maxNote;
                        o.params.readOnly.p_playOutOfReachNotes && (isBelowMin || isAboveMax);
                    };

                    PlayNotes.prototype.getVelocity = function (trackId, note) {
                        var velocity = o.params.readOnly.p_volumes[trackId] * note.velocity;
                        var maxVelocity = o.params.readOnly.p_maxVelocity[trackId];
                        if (maxVelocity && velocity > maxVelocity) {
                            velocity = maxVelocity;
                        }
                        return velocity;
                    };
                    return PlayNotes;
                })();
                BasicFns.PlayNotes = PlayNotes;
            })(Players.BasicFns || (Players.BasicFns = {}));
            var BasicFns = Players.BasicFns;
        })(Game.Players || (Game.Players = {}));
        var Players = Game.Players;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=playNotes.js.map

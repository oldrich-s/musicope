define(["require", "exports", "../../parsers/_load"], function(require, exports, __parsers__) {
    /// <reference path="../../_references.ts" />
    var parsers = __parsers__;

    var Basic = (function () {
        function Basic(midi, params) {
            this.params = params;
            this.minPlayedNoteId = 200;
            this.maxPlayedNoteId = 0;
            var o = this;
            o.setParamsFromParser(new parsers.Midi(midi));
            o.sortPlayerTracksByHands();
            o.normalizeVolumeOfPlayerTracks();
            o.filterSustainNotes();
            o.computeSceneSustainNotes();
            o.computeSceneTracks();
            o.setMinMaxNoteId();
            o.computeCleanedPlayerTracks();
            o.computeTimePerSong();
        }
        Basic.prototype.setParamsFromParser = function (parser) {
            var o = this;
            o.noteValuePerBeat = parser.noteValuePerBeat;
            o.timePerBar = parser.timePerBar;
            o.timePerBeat = parser.timePerBeat;
            o.playerTracks = parser.tracks;
            o.sustainNotes = parser.sustainNotes;
        };
        Basic.prototype.sortPlayerTracksByHands = function () {
            var o = this;
            o.playerTracks = o.params.readOnly.f_trackIds.map(function (trackId) {
                return o.playerTracks[trackId] || [];
            });
        };
        Basic.prototype.normalizeVolumeOfPlayerTracks = function () {
            var o = this;
            if(o.params.readOnly.f_normalize) {
                var sumVelocity = 0, n = 0;
                o.playerTracks.forEach(function (notes) {
                    notes.forEach(function (note) {
                        if(note.on) {
                            n++;
                            sumVelocity += note.velocity;
                        }
                    });
                });
                var scaleVel = o.params.readOnly.f_normalize / (sumVelocity / n);
                if(scaleVel < 1.0) {
                    o.playerTracks.forEach(function (notes) {
                        notes.forEach(function (note) {
                            note.velocity = Math.max(0, Math.min(127, scaleVel * note.velocity));
                        });
                    });
                }
            }
        };
        Basic.prototype.filterSustainNotes = function () {
            var o = this;
            var last = false;
            o.sustainNotes = o.sustainNotes.filter(function (note) {
                var isok = (note.on && !last) || (!note.on && last);
                last = note.on;
                return isok;
            });
        };
        Basic.prototype.computeSceneSustainNotes = function () {
            var o = this;
            o.sceneSustainNotes = [];
            var tempNote;
            o.sustainNotes.forEach(function (note) {
                if(note.on) {
                    if(tempNote) {
                        o.sceneSustainNotes.push({
                            timeOn: tempNote.time,
                            timeOff: note.time
                        });
                    }
                    tempNote = note;
                } else if(tempNote) {
                    o.sceneSustainNotes.push({
                        timeOn: tempNote.time,
                        timeOff: note.time
                    });
                    tempNote = undefined;
                }
            });
        };
        Basic.prototype.computeSceneTracks = function () {
            var o = this;
            o.sceneTracks = o.playerTracks.map(function (playerNotes) {
                var sceneNotes = [], tempNotes = {
                };
                playerNotes.forEach(function (note, i) {
                    if(note.on) {
                        if(tempNotes[note.id]) {
                            var noteScene = o.getSceneNote(tempNotes[note.id], note);
                            sceneNotes.push(noteScene);
                        }
                        tempNotes[note.id] = note;
                    } else {
                        var tn = tempNotes[note.id];
                        if(tn) {
                            var noteScene = o.getSceneNote(tempNotes[note.id], note);
                            sceneNotes.push(noteScene);
                            tempNotes[note.id] = undefined;
                        }
                    }
                });
                return sceneNotes;
            });
        };
        Basic.prototype.getSceneNote = function (noteOn, noteOff) {
            return {
                timeOn: noteOn.time,
                timeOff: noteOff.time,
                id: noteOn.id,
                velocityOn: noteOn.velocity,
                velocityOff: noteOff.velocity
            };
        };
        Basic.prototype.setMinMaxNoteId = function () {
            var o = this;
            o.sceneTracks.forEach(function (notes) {
                notes.forEach(function (note) {
                    o.maxPlayedNoteId = Math.max(note.id, o.maxPlayedNoteId);
                    o.minPlayedNoteId = Math.min(note.id, o.minPlayedNoteId);
                });
            });
        };
        Basic.prototype.computeCleanedPlayerTracks = function () {
            var o = this;
            o.playerTracks = o.sceneTracks.map(function (sceneNotes) {
                var notesPlayer = [];
                sceneNotes.forEach(function (note) {
                    notesPlayer.push({
                        on: true,
                        time: note.timeOn,
                        id: note.id,
                        velocity: note.velocityOn
                    });
                    notesPlayer.push({
                        on: false,
                        time: note.timeOff,
                        id: note.id,
                        velocity: note.velocityOff
                    });
                });
                return notesPlayer.sort(function (a, b) {
                    var dt = a.time - b.time;
                    if(dt !== 0) {
                        return dt;
                    } else {
                        return a.on ? 1 : -1;
                    }
                });
            });
        };
        Basic.prototype.computeTimePerSong = function () {
            var o = this;
            o.timePerSong = 0;
            o.playerTracks.forEach(function (notes) {
                notes.forEach(function (note) {
                    if(note.time > o.timePerSong) {
                        o.timePerSong = note.time;
                    }
                });
            });
        };
        return Basic;
    })();
    exports.Basic = Basic;    
})
//@ sourceMappingURL=_main.js.map

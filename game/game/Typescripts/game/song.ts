module Musicope.Game {

    export class Song {

        timePerBeat: number;
        timePerBar: number;
        noteValuePerBeat: number; // denominator in time signature: 2, 4, 8, 16 ...
        playerTracks: Parsers.INote[][];
        sustainNotes: Parsers.ISustainNote[];

        timePerSong: number;
        minPlayedNoteId = 200;
        maxPlayedNoteId = 0;
        sceneTracks: INoteScene[][];
        sceneSustainNotes: ISustainNoteScene[];

        constructor(midi: Uint8Array) {
            var o = this;
            o.setParamsFromParser(new Parsers.Midi.Midi(midi));
            o.sortPlayerTracksByHands();
            o.normalizeVolumeOfPlayerTracks();
            o.filterSustainNotes();
            o.computeSceneSustainNotes();
            o.computeSceneTracks();
            o.setMinMaxNoteId();
            o.computeCleanedPlayerTracks();
            o.computeTimePerSong();
        }

        private setParamsFromParser(parser: Parsers.IParser) {
            var o = this;
            o.noteValuePerBeat = parser.noteValuePerBeat;
            o.timePerBar = parser.timePerBar;
            o.timePerBeat = parser.timePerBeat;
            o.playerTracks = parser.tracks;
            o.sustainNotes = parser.sustainNotes;
        }

        private sortPlayerTracksByHands() {
            var o = this;
            o.playerTracks = params.f_trackIds.map((trackId) => {
                return o.playerTracks[trackId] || [];
            });
        }

        private normalizeVolumeOfPlayerTracks() {
            var o = this;
            if (params.f_normalize) {
                var sumVelocity = 0, n = 0;
                o.playerTracks.forEach((notes) => {
                    notes.forEach((note) => {
                        if (note.on) { n++; sumVelocity += note.velocity; }
                    });
                });
                var scaleVel = params.f_normalize / (sumVelocity / n);
                if (scaleVel < 1.0) {
                    o.playerTracks.forEach((notes) => {
                        notes.forEach((note) => { note.velocity = Math.max(0, Math.min(127, scaleVel * note.velocity)); });
                    });
                }
            }
        }

        private filterSustainNotes() {
            var o = this;
            var last = false;
            o.sustainNotes = o.sustainNotes.filter((note) => {
                var isok = (note.on && !last) || (!note.on && last);
                last = note.on;
                return isok;
            });
        }

        private computeSceneSustainNotes() {
            var o = this;
            o.sceneSustainNotes = [];
            var tempNote: Parsers.ISustainNote;
            o.sustainNotes.forEach((note) => {
                if (note.on) {
                    if (tempNote) {
                        o.sceneSustainNotes.push({ timeOn: tempNote.time, timeOff: note.time });
                    }
                    tempNote = note;
                } else if (tempNote) {
                    o.sceneSustainNotes.push({ timeOn: tempNote.time, timeOff: note.time });
                    tempNote = undefined;
                }
            });
        }

        private computeSceneTracks() {
            var o = this;
            o.sceneTracks = o.playerTracks.map((playerNotes) => {
                var sceneNotes: INoteScene[] = [], tempNotes = {};
                playerNotes.forEach(function (note, i) {
                    if (note.on) {
                        if (tempNotes[note.id]) {
                            var noteScene = o.getSceneNote(tempNotes[note.id], note);
                            sceneNotes.push(noteScene);
                        }
                        tempNotes[note.id] = note;
                    } else {
                        var tn = tempNotes[note.id];
                        if (tn) {
                            var noteScene = o.getSceneNote(tempNotes[note.id], note);
                            sceneNotes.push(noteScene);
                            tempNotes[note.id] = undefined;
                        }
                    }
                });
                return sceneNotes;
            });
        }

        private getSceneNote(noteOn: Parsers.INote, noteOff: Parsers.INote) {
            return {
                timeOn: noteOn.time,
                timeOff: noteOff.time,
                id: noteOn.id,
                velocityOn: noteOn.velocity,
                velocityOff: noteOff.velocity
            };
        }

        private setMinMaxNoteId() {
            var o = this;
            o.sceneTracks.forEach((notes) => {
                notes.forEach((note) => {
                    o.maxPlayedNoteId = Math.max(note.id, o.maxPlayedNoteId);
                    o.minPlayedNoteId = Math.min(note.id, o.minPlayedNoteId);
                });
            });
        }

        private computeCleanedPlayerTracks() {
            var o = this;
            o.playerTracks = o.sceneTracks.map((sceneNotes) => {
                var notesPlayer: Parsers.INote[] = [];
                sceneNotes.forEach((note) => {
                    notesPlayer.push({ on: true, time: note.timeOn, id: note.id, velocity: note.velocityOn });
                    notesPlayer.push({ on: false, time: note.timeOff, id: note.id, velocity: note.velocityOff });
                });
                return notesPlayer.sort((a, b) => {
                    var dt = a.time - b.time;
                    if (dt !== 0) {
                        return dt;
                    } else {
                        return a.on ? 1 : -1;
                    }
                });
            });
        }

        private computeTimePerSong() {
            var o = this;
            o.timePerSong = 0;
            o.playerTracks.forEach((notes) => {
                notes.forEach(function (note) {
                    if (note.time > o.timePerSong) { o.timePerSong = note.time; }
                });
            });
        }

    }

} 
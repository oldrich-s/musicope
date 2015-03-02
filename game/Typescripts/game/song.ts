module Musicope.Game {

    function computeTimePerSong(playerTracks: Parsers.INote[][]) {
        var timePerSong = 0;
        playerTracks.forEach((notes) => {
            notes.forEach(function (note) {
                if (note.time > timePerSong) {
                    timePerSong = note.time;
                }
            });
        });
        return timePerSong;
    }

    function computeCleanedPlayerTracks(sceneTracks: INoteScene[][]) {
        var playerTracks = sceneTracks.map((sceneNotes) => {
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
        return playerTracks;
    }

    function getMinMaxNoteId(sceneTracks: INoteScene[][]): IMinMax {
        var min = 1e6, max = -1e6;
        sceneTracks.forEach((notes) => {
            notes.forEach((note) => {
                max = Math.max(note.id, max);
                min = Math.min(note.id, min);
            });
        });
        return { min: min, max: max };
    }

    function getSceneNote(noteOn: Parsers.INote, noteOff: Parsers.INote) {
        return {
            timeOn: noteOn.time,
            timeOff: noteOff.time,
            id: noteOn.id,
            velocityOn: noteOn.velocity,
            velocityOff: noteOff.velocity
        };
    }

    function computeSceneTracks(playerTracks: Parsers.INote[][]) {
        var sceneTracks = playerTracks.map((playerNotes) => {
            var sceneNotes: INoteScene[] = [], tempNotes = {};
            playerNotes.forEach(function (note, i) {
                if (note.on) {
                    if (tempNotes[note.id]) {
                        var noteScene = getSceneNote(tempNotes[note.id], note);
                        sceneNotes.push(noteScene);
                    }
                    tempNotes[note.id] = note;
                } else {
                    var tn = tempNotes[note.id];
                    if (tn) {
                        var noteScene = getSceneNote(tempNotes[note.id], note);
                        sceneNotes.push(noteScene);
                        tempNotes[note.id] = undefined;
                    }
                }
            });
            return sceneNotes;
        });
        return sceneTracks;
    }

    function computeSceneSustainNotes(sustainNotes: Parsers.ISustainNote[]) {
        var sceneSustainNotes = [];
        var tempNote: Parsers.ISustainNote;
        sustainNotes.forEach((note) => {
            if (note.on) {
                if (tempNote) {
                    sceneSustainNotes.push({ timeOn: tempNote.time, timeOff: note.time });
                }
                tempNote = note;
            } else if (tempNote) {
                sceneSustainNotes.push({ timeOn: tempNote.time, timeOff: note.time });
                tempNote = undefined;
            }
        });
        return sceneSustainNotes;
    }

    function filterSustainNotes(sustainNotes: Parsers.ISustainNote[]) {
        var last = false;
        var filteredNotes = sustainNotes.filter((note) => {
            var isok = (note.on && !last) || (!note.on && last);
            last = note.on;
            return isok;
        });
        return filteredNotes;
    }

    function getMeanVelocity(playerTracks: Parsers.INote[][]) {
        var sumVelocity = 0, n = 0;
        playerTracks.forEach((notes) => {
            notes.forEach((note) => {
                if (note.on) {
                    n = n + 1;
                    sumVelocity += note.velocity;
                }
            });
        });
        return sumVelocity / n;
    }

    function normalizeVolumeOfPlayerTracks(playerTracks: Parsers.INote[][]) {
        if (params.f_normalize) {
            var meanVel = getMeanVelocity(playerTracks);
            var scaleVel = params.f_normalize / meanVel;
            if (scaleVel < 1.0) {
                playerTracks.forEach((notes) => {
                    notes.forEach((note) => {
                        var limitVel = Math.min(127, scaleVel * note.velocity);
                        note.velocity = Math.max(0, limitVel);
                    });
                });
            }
        }
    }

    function sortPlayerTracksByHands(playerTracks: Parsers.INote[][]) {
        return params.f_trackIds.map((trackId) => {
            return playerTracks[trackId] || [];
        });
    }

    export class Song {
        midi: Parsers.IParser;
        timePerSong: number;
        playedNoteID: IMinMax;
        sceneTracks: INoteScene[][];
        sceneSustainNotes: ISustainNoteScene[];

        constructor(data: Uint8Array) {
            var o = this;
            o.midi = Parsers.Midi.parseMidi(data);
            o.midi.tracks = sortPlayerTracksByHands(o.midi.tracks);
            normalizeVolumeOfPlayerTracks(o.midi.tracks);
            o.midi.sustainNotes = filterSustainNotes(o.midi.sustainNotes);
            o.sceneSustainNotes = computeSceneSustainNotes(o.midi.sustainNotes);
            o.sceneTracks = computeSceneTracks(o.midi.tracks);
            o.playedNoteID = getMinMaxNoteId(o.sceneTracks);
            o.midi.tracks = computeCleanedPlayerTracks(o.sceneTracks);
            o.timePerSong = computeTimePerSong(o.midi.tracks);
        }
    }

} 
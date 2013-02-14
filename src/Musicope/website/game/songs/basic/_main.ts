/// <reference path="../../_references.ts" />

import parsers = module("../../parsers/_load");

export class Basic implements IGame.ISong {

  timePerBeat: number;
  timePerBar: number;
  noteValuePerBeat: number; // denominator in time signature: 2, 4, 8, 16 ...
  playerTracks: IGame.INote[][];

  notesOutOfReach = false;
  timePerSong: number;
  sceneTracks: IGame.INoteScene[][];
  minNoteId = 200;
  maxNoteId = 0;
  
  constructor(midi: Uint8Array, private params: IGame.IParams) {
    var o = this;
    o.setParamsFromParser(new parsers.Midi(midi));
    o.sortPlayerTracksByHands();
    o.normalizeVolumeOfPlayerTracks();
    o.computeSceneTracks();
    o.setMinMaxNoteId();
    o.computeCleanedPlayerTracks();
    o.computeTimePerSong();
  }

  private setParamsFromParser(parser: IGame.IParser) {
    var o = this;
    o.noteValuePerBeat = parser.noteValuePerBeat;
    o.timePerBar = parser.timePerBar;
    o.timePerBeat = parser.timePerBeat;
    o.playerTracks = parser.tracks;
  }

  private sortPlayerTracksByHands() {
    var o = this;
    o.playerTracks = o.params.readOnly.f_trackIds.map((trackId) => {
      return o.playerTracks[trackId] || [];
    });
  }

  private normalizeVolumeOfPlayerTracks() {
    var o = this;
    if (o.params.readOnly.f_normalize) {
      var sumVelocity = 0, n = 0;
      o.playerTracks.forEach((notes) => {
        notes.forEach((note) => {
          if (note.on) { n++; sumVelocity += note.velocity; }
        });
      });
      var scaleVel = o.params.readOnly.f_normalize / (sumVelocity / n);
      o.playerTracks.forEach((notes) => {
        notes.forEach((note) => { note.velocity = Math.max(0, Math.min(127, scaleVel * note.velocity)); });
      });
    }
  }

  private computeSceneTracks() {
    var o = this;
    o.sceneTracks = o.playerTracks.map((playerNotes) => {
      var sceneNotes: IGame.INoteScene[] = [], tempNotes = {};
      playerNotes.forEach(function (note, i) {
        if (note.on) {
          if (tempNotes[note.id]) {
            var noteScene = o.getSceneNote(tempNotes[note.id], note);
            sceneNotes.push(noteScene);
          }
          tempNotes[note.id] = note;
        } else if (!note.on) {
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

  private getSceneNote(noteOn: IGame.INote, noteOff: IGame.INote) {
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
        if (note.id > 0) {
          o.maxNoteId = Math.max(note.id, o.maxNoteId);
          o.minNoteId = Math.min(note.id, o.minNoteId);
        }
      });
    });
  }
  
  private computeCleanedPlayerTracks() {
    var o = this;
    o.playerTracks = o.sceneTracks.map((sceneNotes) => {
      var notesPlayer: IGame.INote[] = [];
      sceneNotes.forEach((note) => {
        notesPlayer.push({ on: true, time: note.timeOn, id: note.id, velocity: note.velocityOn });
        notesPlayer.push({ on: false, time: note.timeOff, id: note.id, velocity: note.velocityOff });
      });
      return notesPlayer.sort((a, b) => { return a.time - b.time; });
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

/// <reference path="../../_references.ts" />

//import benchmarkM = module("./benchmark");
//var benchmark = new benchmarkM.Benchmark();

export class Basic implements IGame.IPlayer {

  private notes: IGame.INote[][];
  private unknownNotes: IGame.INote[] = [];

  constructor(private device: IDevice, private song: IGame.ISong, private metronome: IGame.IMetronome,
              private scene: IGame.IScene, private params: IGame.IParams) {
    var o = this;

    o.correctTimesInParams();
    o.subscribeToParamsChange();
    o.addUserTimeToNotes();
    o.initDevice();
  }

  step() {
    var o = this;
    var isSongEnd = o.updateTime();
    o.setIfWaitOnUser(0);
    o.playNotes(0);
    o.setIfWaitOnUser(1);
    o.playNotes(1);
    o.metronome.play(o.params.readOnly.p_elapsedTime);
    o.scene.redraw(o.params.readOnly.p_elapsedTime, o.params.readOnly.p_isPaused);
    return isSongEnd;
  }

  private correctTimesInParams() {
    var o = this;
    if (typeof o.params.readOnly.p_initTime == 'undefined') {
      o.params.setParam("p_initTime", -2 * o.song.timePerBar);
    }
    if (typeof o.params.readOnly.p_elapsedTime == 'undefined') {
      o.params.setParam("p_elapsedTime", o.params.readOnly.p_initTime);
    }
  }


  private subscribeToParamsChange() {
    var o = this;
    o.params.subscribe("^p_.+$", (name, value) => {
      o.reset();
    });
  }

  private reset() {
    var o = this;
    o.scene.unsetAllPressedNotes();
    o.metronome.reset();
    o.waitId.forEach((_, i) => {
      if (o.notes[i].length > 0) {
        o.waitId[i] = o.notes[i].length - 1;
        while (o.waitId[i] > 0 && o.notes[i][o.waitId[i]] && o.notes[i][o.waitId[i]].time > o.params.readOnly.p_elapsedTime) { o.waitId[i]--; }
        o.playId[i] = o.waitId[i];
        for (var j = o.waitId[i]; j < o.notes[i].length; j++) {
          o.notes[i][j]["userTime"] = undefined;
        }
      }
    });
  }

  private addUserTimeToNotes() {
    var o = this;
    o.notes = o.song.playerTracks.map((notes) => {
      return notes.map((note) => {
        var newNote = <any> $.extend(true, {}, note);
        newNote["userTime"] = undefined;
        return newNote;
      });
    });
  }

  private initDevice() {
    var o = this;
    var midiOut = o.params.readOnly.p_deviceOut;
    var midiIn = o.params.readOnly.p_deviceIn;
    o.device.outOpen(midiOut);
    o.device.out(0x80, 0, 0);
    o.device.inOpen(midiIn, o.deviceIn());
  }

  private deviceIn() {
    var o = this;
    var oldTimeStamp = -1;
    var oldVelocity = -1;
    var oldId = -1;
    return function callback(timeStamp, kind, noteId, velocity) {
      o.sendBackToDevice(kind, noteId, velocity);
      var isNoteOn = kind > 143 && kind < 160 && velocity > 0;
      var isNoteOff = (kind > 127 && kind < 144) || (kind > 143 && kind < 160 && velocity == 0);
      if (isNoteOff || isNoteOn) {
        var isSimilarTime = Math.abs(timeStamp - oldTimeStamp) < 3;
        var idMaches = Math.abs(noteId - oldId) == 12;
        var isDoubleNote = isNoteOn && isSimilarTime && idMaches && velocity == oldVelocity;
        if (!isDoubleNote) {
          if (isNoteOn) { o.scene.setPressedNote(noteId); }
          else if (isNoteOff) { o.scene.unsetPressedNote(noteId); }
          o.addToNotes(isNoteOn, noteId, velocity);
        }
        oldTimeStamp = timeStamp;
        oldVelocity = velocity;
        oldId = noteId;
      }
    }
  }

  private sendBackToDevice(kind, noteId, velocity) {
    var o = this;
    if (kind < 242 && (kind < 127 || kind > 160)) {
      o.device.out(kind, noteId, velocity);
    } else if (kind < 242) {
      //o.device.out(kind, noteId, velocity);
      var a = 5;
    }
  }

  private addToNotes(isNoteOn, noteId, velocity) {
    var o = this;
    var foundNote = o.addToKnownNotes(noteId, isNoteOn);
    if (!foundNote) {
      o.unknownNotes.push({
        on: isNoteOn,
        time: o.params.readOnly.p_elapsedTime,
        id: noteId,
        velocity: velocity
      });
    }
  }

  private addToKnownNotes(noteId: number, isNoteOn: bool) {
    var o = this;
    var found = false;
    o.params.readOnly.p_userHands.forEach((userHand, i) => {
      if (userHand && !found) {
        var id = o.waitId[i];
        while (o.notes[i][id] && o.notes[i][id].time < o.params.readOnly.p_elapsedTime + o.params.readOnly.p_radiuses[i]) {
          var note = o.notes[i][id];
          var radius = Math.abs(o.notes[i][id].time - o.params.readOnly.p_elapsedTime) - 50;
          if (note.id === noteId && isNoteOn == note.on && radius < o.params.readOnly.p_radiuses[i]) {
            o.notes[i][id]["userTime"] = o.params.readOnly.p_elapsedTime;
            found = true; break;
          }
          id++;
        }
      }
    });
    return found;
  }

  private previousTime: number;
  private stops = [false, false];
  private updateTime() {
    var o = this;
    var currentTime = o.device.time();
    if (!o.previousTime) { o.previousTime = currentTime; }
    var duration = currentTime - o.previousTime;
    o.previousTime = currentTime;

    var isSongEnd = o.params.readOnly.p_elapsedTime > o.song.timePerSong + 1000;
    
    var doFreezeTime =
      isSongEnd ||
      o.params.readOnly.p_isPaused ||
      o.stops[0] || o.stops[1] || /*waiting for hands*/
      duration > 100; /*window was out of focus*/
      
    if (!doFreezeTime) {
      var newElapsedTime = o.params.readOnly.p_elapsedTime + o.params.readOnly.p_speed * duration;
      o.params.setParam("p_elapsedTime", newElapsedTime, true);
    }

    return isSongEnd;
  }

  private waitId = [0, 0];
  private setIfWaitOnUser(trackId: number) {
    var o = this;

    o.stops[trackId] = false;

    function lastIdsNoteBelowCurrentTimeMinusRadius() {
      return o.notes[trackId][o.waitId[trackId]] && o.notes[trackId][o.waitId[trackId]].time < o.params.readOnly.p_elapsedTime - o.params.readOnly.p_radiuses[trackId]
    }

    var isWait = o.params.readOnly.p_userHands[trackId] && o.params.readOnly.p_waits[trackId];
    if (isWait) {
      while (lastIdsNoteBelowCurrentTimeMinusRadius()) {
        var note = o.notes[trackId][o.waitId[trackId]];
        var isSustain = note.id === -1;
        var wasPlayedByUser = note["userTime"];
        var isNoteAboveMin = note.id >= o.params.readOnly.p_minNote;
        var isNoteBelowMax = note.id <= o.params.readOnly.p_maxNote;
        if (note.on && !isSustain && !wasPlayedByUser && isNoteAboveMin && isNoteBelowMax) {
          o.stops[trackId] = true;
          break;
        }
        o.waitId[trackId]++;
      }
    }
  }

  private playId = [0, 0];
  private playNotes(trackId: number) {
    var o = this;
    function lastIdsNoteBelowCurrentTime() {
      return o.notes[trackId][o.playId[trackId]] && o.notes[trackId][o.playId[trackId]].time < o.params.readOnly.p_elapsedTime;
    }
    while (lastIdsNoteBelowCurrentTime()) {
      var note = o.notes[trackId][o.playId[trackId]];
      o.playSustain(note);
      o.playNote(note, trackId);
      o.playId[trackId]++;
    }
  }

  private playSustain(note: IGame.INote) {
    var o = this;
    var isSustain = o.params.readOnly.p_sustain && note.id == -1;
    if (isSustain) {
      if (note.on) {
        o.device.out(176, 64, 127);
      } else {
        o.device.out(176, 64, 0);
      }
    }
  }

  private playNote(note: IGame.INote, trackId: number) {
    var o = this;
    var playsUser = o.params.readOnly.p_userHands[trackId];
    var isBelowMin = note.id < o.params.readOnly.p_minNote;
    var isAboveMax = note.id > o.params.readOnly.p_maxNote;
    var playOutOfReach = o.song.notesOutOfReach && (isBelowMin || isAboveMax);
    if (!playsUser || playOutOfReach) {
      if (note.on) {
        o.device.out(144, note.id, Math.min(127, o.params.readOnly.p_volumes[trackId] * note.velocity));
        o.scene.setPressedNote(note.id);
      } else {
        o.device.out(144, note.id, 0);
        o.scene.unsetPressedNote(note.id);
      }
    }
  }



  

}

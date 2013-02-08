/// <reference path="../../_references.ts" />

//import benchmarkM = module("./benchmark");
//var benchmark = new benchmarkM.Benchmark();

interface INote extends IGame.INotePlayer {
  userTime: number;
}

export class Basic implements IGame.IPlayer {

  private notes: INote[][];
  private unknownNotes: IGame.INotePlayer[] = [];
  private theEnd: bool = false;

  constructor(private device: IDevice, private parser: IGame.IParser, private metronome: IGame.IMetronome,
              private scene: IGame.IScene, private params: IGame.IParams) {
    var o = this;

    o.correctTimesInParams();
    o.subscribeToParamsChange();
    o.notes = o.getNotesWithUserTime();
    o.initDevice();
  }

  step() {
    var o = this;
    var isSongEnd = o.updateTime();
    o.processNotes(0);
    o.processNotes(1);
    o.metronome.play(o.params.readOnly.p_elapsedTime);
    o.scene.redraw(o.params.readOnly.p_elapsedTime, o.params.readOnly.p_isPaused);
    return isSongEnd;
  }

  private correctTimesInParams() {
    var o = this;
    if (typeof o.params.readOnly.p_initTime == 'undefined') {
      o.params.setParam("p_initTime", -2 * o.parser.timePerBar);
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

  private getNotesWithUserTime() {
    var o = this;
    return o.parser.playerTracks.map((oldNotes) => {
      return oldNotes.map((n) => {
        return { on: n.on, time: n.time, id: n.id, velocity: n.velocity, userTime: undefined };
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

  private reset() {
    var o = this;

    o.scene.unsetAllPressedNotes();
    o.metronome.reset();

    o.waitId.forEach((_, i) => {
      o.waitId[i] = o.notes[i].length - 1;
      while (o.notes[i][o.waitId[i]] && o.notes[i][o.waitId[i]].time > o.params.readOnly.p_elapsedTime) { o.waitId[i]--; }
      o.playId[i] = o.waitId[i] + 1;
      for (var j = o.waitId[i]; j < o.notes[i].length; j++) {
        o.notes[i][j].userTime = undefined;
      }
    });
  }

  private previousTime: number;
  private stops = [false, false];
  private updateTime() {
    var o = this;
    var currentTime = o.device.time();
    if (!o.previousTime) { o.previousTime = currentTime; }
    var duration = currentTime - o.previousTime;
    o.previousTime = currentTime;

    var isSongEnd = o.params.readOnly.p_elapsedTime > o.parser.timePerSong + 1000;
    
    var freezeTime =
      o.params.readOnly.p_isPaused ||
      (o.stops[0] && o.stops[1]) || /*waiting for hands*/
      duration < 100; /*window was out of focus*/
      
    if (!freezeTime) {
      o.params.readOnly.p_elapsedTime = o.params.readOnly.p_elapsedTime + o.params.readOnly.p_speed * duration;
    }

    return isSongEnd;
  }

  private processNotes(i: number) {
    var o = this;
    o.stops[i] = false;
    o.setIfWaitOnUser(i);
    o.playNotes(i);
  }

  private waitId = [0, 0];
  private setIfWaitOnUser(trackId: number) {
    var o = this;

    function lastIdsNoteBelowCurrentTimeMinusRadius() {
      return o.notes[trackId][o.waitId[trackId]] && o.notes[trackId][o.waitId[trackId]].time < o.params.readOnly.p_elapsedTime - o.params.readOnly.p_radiuses[trackId]
    }

    var isWait = o.params.readOnly.p_userHands[trackId] && o.params.readOnly.p_waits[trackId];
    if (isWait) {
      while (lastIdsNoteBelowCurrentTimeMinusRadius()) {
        var note = o.notes[trackId][o.waitId[trackId]];
        var isSustain = note.id === -1;
        var wasPlayedByUser = note.userTime;
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

  private playSustain(note: INote) {
    var o = this;
    var isSustain = o.params.readOnly.p_sustain && note.id == -1;
    if (isSustain) {
      if (note.on) {
        o.device.out(176, 64, 127);
        o.device.out(177, 64, 127);
      } else {
        o.device.out(176, 64, 0);
        o.device.out(177, 64, 0);
      }
    }
  }

  private ons = [144, 145];
  private playNote(note: INote, trackId: number) {
    var o = this;
    var playsUser = o.params.readOnly.p_userHands[trackId];
    var isBelowMin = note.id < o.params.readOnly.p_minNote;
    var isAboveMax = note.id > o.params.readOnly.p_maxNote;
    if (!playsUser || isBelowMin || isAboveMax) {
      if (note.on) {
        o.device.out(o.ons[trackId], note.id, Math.min(127, o.params.readOnly.p_volumes[trackId] * note.velocity));
        o.scene.setPressedNote(note.id);
      } else {
        o.device.out(o.ons[trackId], note.id, 0);
        o.scene.unsetPressedNote(note.id);
      }
    }
  }



  private deviceIn() {
    var o = this;
    return function callback(timeStamp, kind, noteId, velocity) {
      //o.device.out(kind, noteId, velocity);
      var isNoteOn = kind > 143 && kind < 160 && velocity > 0;
      var isNoteOff = (kind > 127 && kind < 144) || (kind > 143 && kind < 160 && velocity == 0);
      if (isNoteOn) { o.scene.setPressedNote(noteId); } else if (isNoteOff) { o.scene.unsetPressedNote(noteId); }
      if (isNoteOff || isNoteOn) {
        var found = false;
        o.params.readOnly.p_userHands.forEach((userHand, i) => {
          if (userHand && !found) {
            var id = o.waitId[i];
            while (o.notes[i][id] && o.notes[i][id].time < o.params.readOnly.p_elapsedTime + o.params.readOnly.p_radiuses[i]) {
              var note = o.notes[i][id];
              var radius = Math.abs(o.notes[i][id].time - o.params.readOnly.p_elapsedTime) - 50;
              if (note.id === noteId && isNoteOn == note.on && radius < o.params.readOnly.p_radiuses[i]) {
                o.notes[i][id].userTime = o.params.readOnly.p_elapsedTime;
                found = true; break;
              }
              id++;
            }
          }
        });
        if (!found) {
          o.unknownNotes.push({
            on: isNoteOn,
            time: o.params.readOnly.p_elapsedTime,
            id: noteId,
            velocity: velocity
          });
        }
      }
    }
  }

}

/// <reference path="../../_references.ts" />

import defParams = module("../../_paramsDefault");
import paramService = module("../../../common/services.params");
import metronomes = module("../../metronomes/_load");

//import benchmarkM = module("./benchmark");
//var benchmark = new benchmarkM.Benchmark();

interface INote extends INotePlayer {
  userTime: number;
}

export class Basic implements IPlayer {

  metronome: IMetronome;

  private notes: INote[][];
  private unknownNotes: INotePlayer[] = [];
  private theEnd: bool = false;

  constructor(private device: IDevice, private viewer: IScene, private parser: IParser, private params: IPlayerParams) {
    var o = this;
    o.device = device; o.viewer = viewer; o.parser = parser;
    o.params = paramService.copy(params, defParams.iPlayerParams);
    if (typeof o.params.p_initTime == 'undefined') { o.params.p_initTime = -2 * o.parser.timePerBar; }
    if (typeof o.params.p_elapsedTime == 'undefined') { o.params.p_elapsedTime = o.params.p_initTime; }
      
    o.notes = o.parser.tracksPlayer.map((oldNotes) => {
      return oldNotes.map((n) => {
        return { on: n.on, time: n.time, id: n.id, velocity: n.velocity, userTime: undefined };
      });
    });

    o.initDevice();
    o.metronome = new metronomes.Basic(parser.timePerBeat, parser.timePerBar / parser.timePerBeat, device, <any>params);
    o.step();
  }

  getParams() {
    var o = this;
    return <IPlayerParams> $.extend(true, {}, o.params);
  }

  setParams(params: IPlayerParams) {
    var o = this;
    o.params = params;
    o.reset();
  }

  private reset() {
    var o = this;

    o.viewer.unsetAllPressedNotes();
    o.metronome.reset();

    o.lastIds.forEach((_, i) => {
      o.lastIds[i] = o.notes[i].length - 1;
      while (o.notes[i][o.lastIds[i]] && o.notes[i][o.lastIds[i]].time > o.params.p_elapsedTime) { o.lastIds[i]--; }
      o.lastIdsPC[i] = o.lastIds[i] + 1;
      for (var j = o.lastIds[i]; j < o.notes[i].length; j++) {
        o.notes[i][j].userTime = undefined;
      }
    });
  }

  private step() {
    var o = this;
    function _step() {
      if (!o.theEnd) {
        (<any>window).webkitRequestAnimationFrame(_step);
//        benchmark.collect();
      }
      o.updateTime();
        
      o.processNotes(0);
      o.processNotes(1);

      o.metronome.play(o.params.p_elapsedTime);
      o.viewer.redraw(o.params.p_elapsedTime, o.params.p_isPaused);
    }
      _step();
  }

  private previousTime: number;
  private waits = [false, false];
  private updateTime() {
    var o = this;
    var currentTime = o.device.time();
    if (!o.previousTime) { o.previousTime = currentTime; }
    var duration = currentTime - o.previousTime;
    o.previousTime = currentTime;
    if (!o.params.p_isPaused && !o.waits[0] && !o.waits[1] && duration < 100) {
      o.params.p_elapsedTime = o.params.p_elapsedTime + o.params.p_speed * duration;
      o.redirectOnSongEnd();
    }
  }

  private redirectOnSongEnd() {
    var o = this;
    if (o.params.p_elapsedTime > o.parser.timePerSong + 1000) {
      if (o.params.p_callbackUrl) {
        window.location.href = o.params.p_callbackUrl;
        o.theEnd = true;
      } else {
        o.params.p_elapsedTime = o.parser.timePerSong;
      }
    }
  }

  private lastIds = [0,0];
  private lastIdsPC = [0,0];
  private ons = [144, 145];
  private processNotes(i: number) {
    var o = this;

    o.waits[i] = false;
    if (o.params.p_userHands[i] && o.params.p_waits[i]) { // user playback
      while (o.notes[i][o.lastIds[i]] && o.notes[i][o.lastIds[i]].time < o.params.p_elapsedTime - o.params.p_radiuses[i]) {
        var note = o.notes[i][o.lastIds[i]];
        if (!note.userTime && note.on && note.id !== -1) { o.waits[i] = true; break; }
        o.lastIds[i]++;
      }
    }
    
    if (!o.params.p_userHands[i] || o.params.p_sustain) { // pc playback
      while (o.notes[i][o.lastIdsPC[i]] && o.params.p_elapsedTime > o.notes[i][o.lastIdsPC[i]].time) {
        var note = o.notes[i][o.lastIdsPC[i]];
        if (note.on) {
          if (note.id == -1) {
            o.device.out(176, 64, 127);
            o.device.out(177, 64, 127);
          } else if (!o.params.p_userHands[i]) { 
            o.device.out(o.ons[i], note.id, Math.min(127, o.params.p_volumes[i] * note.velocity));
            o.viewer.setPressedNote(note.id);
          }
        } else {
          if (note.id == -1) {
            o.device.out(176, 64, 0);
            o.device.out(177, 64, 0);
          } else if (!o.params.p_userHands[i]) { 
            o.device.out(o.ons[i], note.id, 0);
            o.viewer.unsetPressedNote(note.id);
          }
        }
        o.lastIdsPC[i]++;
      }
    }
  }

  private initDevice() {
    var o = this;
    var midiOut = o.params.p_deviceOut;
    var midiIn = o.params.p_deviceIn;
    o.device.outOpen(midiOut);
    o.device.out(0x80, 0, 0);
    o.device.inOpen(midiIn, o.deviceIn());
  }

  private deviceIn() {
    var o = this;
    return function callback(timeStamp, kind, noteId, velocity) {
      //o.device.out(kind, noteId, velocity);
      var isNoteOn = kind > 143 && kind < 160 && velocity > 0;
      var isNoteOff = (kind > 127 && kind < 144) || (kind > 143 && kind < 160 && velocity == 0);
      if (isNoteOn) { o.viewer.setPressedNote(noteId); } else if (isNoteOff) { o.viewer.unsetPressedNote(noteId); }
      if (isNoteOff || isNoteOn) {
        var found = false;
        o.params.p_userHands.forEach((userHand, i) => {
          if (userHand && !found) {
            var id = o.lastIds[i];
            while (o.notes[i][id] && o.notes[i][id].time < o.params.p_elapsedTime + o.params.p_radiuses[i]) {
              var note = o.notes[i][id];
              var radius = Math.abs(o.notes[i][id].time - o.params.p_elapsedTime) - 50;
              if (note.id === noteId && isNoteOn == note.on && radius < o.params.p_radiuses[i]) {
                o.notes[i][id].userTime = o.params.p_elapsedTime;
                found = true; break;
              }
              id++;
            }
          }
        });
        if (!found) {
          o.unknownNotes.push({
            on: isNoteOn,
            time: o.params.p_elapsedTime,
            id: noteId,
            velocity: velocity
          });
        }
      }
    }
  }

}

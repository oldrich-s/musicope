/// <reference path="../../_references.ts" />

import defParams = module("../../_paramsDefault");
import paramService = module("../../../common/services.params");
import metronomes = module("../metronomes/_load");

interface INote extends INotePlayer {
  userTime: number;
}

export class Basic implements IPlayer {

  params: IPlayerParams;
  metronome: IMetronome;

  private device: IDevice;
  private viewer: IScene;
  private parser: IParser;

  private notes: INote[][];
  private unknownNotes: INotePlayer[] = [];
  private theEnd: bool = false;

  constructor() { }

  _init(device: IDevice, viewer: IScene, parser: IParser, params: IPlayerParams) {
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
    o.metronome = new metronomes.basic();
    o.metronome._init(parser.timePerBeat, parser.timePerBar / parser.timePerBeat, device, <any>params);
    o.step();
  }

  private step() {
    var o = this;
    function _step() {
      if (!o.theEnd) {
        (<any>window).webkitRequestAnimationFrame(_step);
      }
      var reseted = o.params.p_elapsedTime !== o.elapTime;
      if (reseted) {
        o.viewer.unsetAllPressedNotes();
        o.metronome.reset();
      }
      o.updateTime();
        
      o.processNotes(0, reseted);
      o.processNotes(1, reseted);

      o.metronome.play(o.params.p_elapsedTime);
      o.viewer.redraw(o.params.p_elapsedTime, o.params.p_isPaused);
    }
      _step();
  }

  private previousTime: number;
  private elapTime: number;
  private wait = false;
  private updateTime() {
    var o = this;
    var currentTime = Date.now();
    if (!o.previousTime) { o.previousTime = currentTime; }
    var duration = currentTime - o.previousTime;
    o.previousTime = currentTime;
    if (!o.params.p_isPaused && !o.wait && duration < 100) {
      o.params.p_elapsedTime = o.elapTime = o.params.p_elapsedTime + o.params.p_speed * duration;
      if (o.params.p_elapsedTime > o.parser.timePerSong + 500) {
        o.params.p_elapsedTime = o.elapTime = o.parser.timePerSong;
      }
    }
  }

  private lastIds = [0,0];
  private lastIdsPC = [0,0];
  private processNotes(i: number, reseted: bool) {
    var o = this;
    if (reseted) {
      o.lastIds[i] = 0;
      while (o.notes[i][o.lastIds[i]] && o.notes[i][o.lastIds[i]].time < o.params.p_elapsedTime) { o.lastIds[i]++; }
      o.lastIdsPC[i] = o.lastIds[i];
      for (var j = o.lastIds[i]; j < o.notes[i].length; j++) {
        o.notes[i][j].userTime = undefined;
      }
    }
    if (o.params.p_volumes[i] === 0 && o.params.p_waits[i]) { // user playback
      o.wait = false;
      while (o.notes[i][o.lastIds[i]] && o.notes[i][o.lastIds[i]].time < o.params.p_elapsedTime - o.params.p_radiuses[i]) {
        var note = o.notes[i][o.lastIds[i]];
        if (!note.userTime && note.on && note.id !== -1) { o.wait = true; break; }
        o.lastIds[i]++;
      }
    } else if (o.params.p_volumes[i] > 0 || o.params.p_sustain) { // pc playback
      var suspends = [176, 177];
      var ons = [144, 145];
      while (o.notes[i][o.lastIds[i]] && o.params.p_elapsedTime > o.notes[i][o.lastIds[i]].time) {
        var note = o.notes[i][o.lastIds[i]];
        if (note.on) {
          if (note.id == -1) {
            o.device.out(suspends[i], 64, note.velocity);
          } else if (o.params.p_volumes[i] > 0) { 
            o.device.out(ons[i], note.id, Math.min(127, o.params.p_volumes[i] * note.velocity));
            o.viewer.setPressedNote(note.id);
          }
        } else {
          if (note.id == -1) {
            o.device.out(suspends[i], 64, 0);
          } else if (o.params.p_volumes[i] > 0) { 
            o.device.out(ons[i], note.id, 0);
            o.viewer.unsetPressedNote(note.id);
          }
        }
        o.lastIds[i]++;
      }
    }
  }

  private deviceIn() {
    var o = this;

    function callback (timeStamp, kind, noteId, velocity) {
      var isNoteOn = kind > 143 && kind < 160 && velocity > 0;
      var isNoteOff = (kind > 127 && kind < 144) || (kind > 143 && kind < 160 && velocity == 0);
      if (isNoteOn) { o.viewer.setPressedNote(noteId); } else if (isNoteOff) { o.viewer.unsetPressedNote(noteId); }
      if (isNoteOff || isNoteOn) {
        var found = false;
        o.params.p_volumes.forEach((vol, i) => {
          if (vol === 0 && !found) {
            var id = o.lastIds[i];
            while (o.notes[i][id] && o.notes[i][id].time < o.params.p_elapsedTime + o.params.p_radiuses[i]) {
              if ( o.notes[i][id].id === noteId && isNoteOn == o.notes[i][id].on &&
                    Math.abs(o.notes[i][id].time - o.params.p_elapsedTime) - 20 < o.params.p_radiuses[i]) {
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
    return callback;
  }

  private initDevice() {
    var o = this;
    var midiOut = o.params.p_deviceOut;
    var midiIn = o.params.p_deviceIn;
    o.device.outOpen(midiOut);
    o.device.out(0x80, 0, 0);
    o.device.inOpen(midiIn, o.deviceIn());
  }

}

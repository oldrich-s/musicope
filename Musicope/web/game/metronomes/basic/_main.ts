/// <reference path="../../_references.ts" />

export class Basic implements IGame.IMetronome {

  private lastPlayedId: number;

  constructor(private timePerBeat: number, private beatsPerBar: number, private device: IDevice, private params: IGame.IParams) {
    var o = this;
    o.timePerBeat = timePerBeat;
    o.beatsPerBar = beatsPerBar;
    o.device = device;
    o.subscribe();
  }

  play(time: number) {
    var o = this;
    if (o.params.readOnly.m_isOn) {
      var id = Math.floor(o.params.readOnly.m_ticksPerBeat * time / o.timePerBeat);
      if (!o.lastPlayedId) { o.lastPlayedId = id; }
      if (id > o.lastPlayedId) {
        var noteId = id % o.beatsPerBar == 0 ? o.params.readOnly.m_id1 : o.params.readOnly.m_id2;
        var velocity = Math.min(127, o.params.readOnly.m_velocity);
        o.device.out(o.params.readOnly.m_channel, noteId, velocity);
        o.lastPlayedId = id;
      }
    }
  }

  reset() { this.lastPlayedId = undefined; }

  private subscribe() {
    var o = this;
    o.params.subscribe("^m_.+$", (name, value) => {
      o.reset();
    });
  }

}
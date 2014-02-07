module Musicope.Game.Metronomes {

  export class Basic implements IMetronome {

    private lastPlayedId: number = -10000;

    constructor(private timePerBeat: number, private beatsPerBar: number, private device: Devices.IDevice, private params: Params.IParams) {
      var o = this;
      o.subscribe();
    }

    play(time: number) {
      var o = this;
      if (o.params.readOnly.m_isOn) {
        var id = Math.floor(o.params.readOnly.m_ticksPerBeat * time / o.timePerBeat);
        if (id > o.lastPlayedId) {
          var noteId = id % o.beatsPerBar == 0 ? o.params.readOnly.m_id1 : o.params.readOnly.m_id2;
          var velocity = Math.min(127, o.params.readOnly.m_velocity);
          o.device.out(o.params.readOnly.m_channel, noteId, velocity);
          o.lastPlayedId = id;
        }
      }
    }

    reset() { this.lastPlayedId = -10000; }

    private subscribe() {
      var o = this;
      o.params.subscribe("metronomes.Basic", "^m_.+$", (name, value) => {
        o.reset();
      });
    }

  }

}
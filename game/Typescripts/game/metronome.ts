module Musicope.Game {

    export class Metronome {

        private lastPlayedId: number = -10000;

        constructor(private timePerBeat: number, private beatsPerBar: number, private device: Devices.IDevice) {
            var o = this;
            o.subscribe();
        }

        play(time: number) {
            var o = this;
            if (params.m_isOn) {
                var id = Math.floor(params.m_ticksPerBeat * time / o.timePerBeat);
                if (id > o.lastPlayedId) {
                    var noteId = id % o.beatsPerBar == 0 ? params.m_id1 : params.m_id2;
                    var velocity = Math.min(127, params.m_velocity);
                    o.device.out(params.m_channel, noteId, velocity);
                    o.lastPlayedId = id;
                }
            }
        }

        reset() { this.lastPlayedId = -10000; }

        private subscribe() {
            var o = this;
            Params.subscribe("metronomes.Basic", "^m_.+$",(name, value) => {
                o.reset();
            });
        }

    }

}
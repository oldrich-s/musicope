module Musicope.Game {

    export class Metronome implements IDisposable {

        private lastPlayedId: number = -10000;

        constructor(private timePerBeat: number, private beatsPerBar: number, private device: IDriver) {
            var o = this;
            o.subscribe();
        }

        play = (time: number) => {
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

        reset = () => {
            var o = this;
            o.lastPlayedId = -10000;
        }

        dispose = () => {
            Params.unsubscribe("metronome");
        }

        private subscribe() {
            var o = this;
            Params.subscribe("metronome", "^m_.+$",(name, value) => {
                o.reset();
            });
        }

    }

}
module Musicope.Game {

    export class Metronome {

        private lastPlayedId: number = -10000;

        constructor(private timePerBeat: number, private beatsPerBar: number) {
            var o = this;
            o.subscribe();
        }

        play = (time: number) => {
            var o = this;
            if (config.m_isOn) {
                var id = Math.floor(config.m_ticksPerBeat * time / o.timePerBeat);
                if (id > o.lastPlayedId) {
                    var noteId = id % o.beatsPerBar == 0 ? config.m_id1 : config.m_id2;
                    var velocity = Math.min(127, config.m_velocity);
                    webMidi.out(config.m_channel, noteId, velocity);
                    o.lastPlayedId = id;
                }
            }
        }

        reset = () => {
            var o = this;
            o.lastPlayedId = -10000;
        }

        private subscribe() {
            var o = this;
            Params.subscribe("metronome", "^m_.+$",(name, value) => {
                o.reset();
            });
        }

    }

}
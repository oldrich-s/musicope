module Musicope.Game {

    export class Metronome {

        private lastPlayedId: number = -10000;
        private keys: string[];

        constructor(private signatures: { [msecs: number]: Parsers.ISignature }) {
            var o = this;
            o.keys = Object.keys(o.signatures).sort((a, b) => Number(b) - Number(a));
            o.subscribe();
        }

        play = (secs: number) => {
            var o = this;
            if (config.m_isOn) {
                var fkeys = o.keys.filter((s) => { return Number(s) < secs; });
                var key = Number(fkeys.length == 0 ? o.keys[o.keys.length - 1] : fkeys[0]);
                var sig: Parsers.ISignature = o.signatures[key];
                var id = Math.floor(config.m_ticksPerBeat * secs / sig.msecsPerBeat);
                if (id > o.lastPlayedId) {
                    var noteId = id % (sig.msecsPerBar / sig.msecsPerBeat) == 0 ? config.m_id1 : config.m_id2;
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
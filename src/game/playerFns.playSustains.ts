module Musicope.Game.PlayerFns {

    function isIdBelowCurrentTime(sustainNotes: Parsers.ISustainNote[], id: number) {
        return sustainNotes[id] && sustainNotes[id].time < config.p_elapsedTime;
    }

    function playSustainNote(note: Parsers.ISustainNote) {
        if (config.p_sustain) {
            if (note.on) {
                webMidi.out(176, 64, 127);
            } else {
                webMidi.out(176, 64, 0);
            }
        }
    }

    export class PlaySustains {

        private id = 0;

        constructor(private sustainNotes: Parsers.ISustainNote[]) {
            var o = this;
        }

        play = () => {
            var o = this;
            while (isIdBelowCurrentTime(o.sustainNotes, o.id)) {
                playSustainNote(o.sustainNotes[o.id]);
                o.id++;
            }
        }

    }

} 
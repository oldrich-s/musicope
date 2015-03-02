module Musicope.Game.PlayerFns {

    function isIdBelowCurrentTime(sustainNotes: Parsers.ISustainNote[], id: number) {
        return sustainNotes[id] && sustainNotes[id].time < params.p_elapsedTime;
    }

    function playSustainNote(driver: IDriver, note: Parsers.ISustainNote) {
        if (params.p_sustain) {
            if (note.on) {
                driver.out(176, 64, 127);
            } else {
                driver.out(176, 64, 0);
            }
        }
    }

    export class PlaySustains {

        private id = 0;

        constructor(private driver: IDriver, private sustainNotes: Parsers.ISustainNote[]) {
            var o = this;
        }

        play = () => {
            var o = this;
            while (isIdBelowCurrentTime(o.sustainNotes, o.id)) {
                playSustainNote(o.driver, o.sustainNotes[o.id]);
                o.id++;
            }
        }

    }

} 
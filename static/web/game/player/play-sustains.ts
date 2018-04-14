import { config } from "../../config/config"
import { webMidi } from "../../web-midi/web-midi"

import { ISustainNote } from "../midi-parser/i-midi-parser"

function isIdBelowCurrentTime(sustainNotes: ISustainNote[], id: number) {
    return sustainNotes[id] && sustainNotes[id].time < (config.p_elapsedTime || 0)
}

function playSustainNote(note: ISustainNote) {
    if (config.p_sustain) {
        if (note.on) {
            webMidi.out(176, 64, 127)
        } else {
            webMidi.out(176, 64, 0)
        }
    }
}

export class PlaySustains {

    private id = 0

    constructor(private sustainNotes: ISustainNote[]) {
        const o = this
    }

    play = () => {
        const o = this
        while (isIdBelowCurrentTime(o.sustainNotes, o.id)) {
            playSustainNote(o.sustainNotes[o.id])
            o.id++
        }
    }

}
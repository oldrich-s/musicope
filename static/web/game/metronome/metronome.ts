import { config, subscribe } from "../../config/config"
import { webMidi } from "../../web-midi/web-midi"

import { ISignature } from "../midi-parser/i-midi-parser"

export class Metronome {

    private lastPlayedId: number = -10000
    private keys: string[]

    constructor(private signatures: { [msecs: number]: ISignature }) {
        const o = this
        o.keys = Object.keys(o.signatures).sort((a, b) => Number(b) - Number(a))
        o.subscribe()
    }

    play = (secs: number) => {
        const o = this
        if (config.m_isOn) {
            const fkeys = o.keys.filter((s) => { return Number(s) < secs })
            const key = Number(fkeys.length == 0 ? o.keys[o.keys.length - 1] : fkeys[0])
            const sig: ISignature = o.signatures[key]
            const id = Math.floor(config.m_ticksPerBeat * secs / sig.msecsPerBeat)
            if (id > o.lastPlayedId) {
                const noteId = id % (sig.msecsPerBar / sig.msecsPerBeat) == 0 ? config.m_id1 : config.m_id2
                const velocity = Math.min(127, config.m_velocity)
                webMidi.out(config.m_channel, noteId, velocity)
                o.lastPlayedId = id
            }
        }
    }

    reset = () => {
        const o = this
        o.lastPlayedId = -10000
    }

    private subscribe() {
        const o = this
        subscribe("metronome", "^m_.+$", (name, value) => {
            o.reset()
        })
    }

}
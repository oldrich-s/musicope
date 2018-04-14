import { config, setParam } from "../../../config/config"
import { Song } from "../../song/song"
import { IKeyboardAction } from "../i-actions"

export function l(keyboardActions: { [key: string]: IKeyboardAction }) {
    const names = ["Reset", "Start defined", "End defined"]

    let state = 0

    keyboardActions["l"] = {
        title: "Loop",
        description: "Define start / stop loop and erase.",
        triggerAction: (song: Song) => {
            const keys = Object.keys(song.midi.signatures).sort((a, b) => Number(b) - Number(a))
            const fkeys = keys.filter((s) => { return Number(s) < (config.p_elapsedTime || 0) })
            const key = Number(fkeys.length == 0 ? keys[keys.length - 1] : fkeys[0])
            const n = ((config.p_elapsedTime || 0) - key) / song.midi.signatures[key].msecsPerBar
            if (state === 0) {
                const startTime = key + Math.floor(n + 0.01) * song.midi.signatures[key].msecsPerBar - 20
                setParam("p_loopStart", startTime)
                state = state + 1
            } else if (state === 1) {
                const endTime = key + Math.ceil(n + 0.01) * song.midi.signatures[key].msecsPerBar
                setParam("p_loopEnd", endTime)
                state = state + 1
            } else {
                setParam("p_loopStart", null)
                setParam("p_loopEnd", null)
                state = 0
            }
        },
        getCurrentState: () => {
            return names[state]
        }
    }

}
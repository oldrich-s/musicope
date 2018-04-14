import { config, setParam } from "../../../config/config"
import { Song } from "../../song/song"
import { IKeyboardAction } from "../i-actions"

export function left(keyboardActions: { [key: string]: IKeyboardAction }) {
    keyboardActions["left"] = {
        title: "Fast backward",
        description: "Fast backward the song by the amount of 2 beats.",
        triggerAction: (song: Song) => {
            const keys = Object.keys(song.midi.signatures).sort((a, b) => Number(b) - Number(a))
            const fkeys = keys.filter((s) => { return Number(s) < (config.p_elapsedTime || 0) - 10 })
            const key = Number(fkeys.length == 0 ? keys[keys.length - 1] : fkeys[0])
            const n = ((config.p_elapsedTime || 0) - key) / song.midi.signatures[key].msecsPerBar
            const newTime = key + Math.floor(n - 0.5) * song.midi.signatures[key].msecsPerBar
            const truncTime = Math.max((config.p_initTime || 0), newTime)
            setParam("p_elapsedTime", truncTime)
        },
        getCurrentState: () => {
            return (config.p_elapsedTime || 0) / 1000
        }
    }
}
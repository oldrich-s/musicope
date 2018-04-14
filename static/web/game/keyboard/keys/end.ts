import { config, setParam } from "../../../config/config"
import { Song } from "../../song/song"
import { IKeyboardAction } from "../i-actions"

export function end(keyboardActions: { [key: string]: IKeyboardAction }) {
    keyboardActions["end"] = {
        title: "Goto end",
        description: "Rewind the song to the end.",
        triggerAction: (song: Song) => {
            var end = 0
            song.midi.tracks.forEach((t) => {
                t.forEach((n) => {
                    if (n.time > end) {
                        end = n.time
                    }
                })
            })
            setParam("p_elapsedTime", end)
        },
        getCurrentState: () => {
            return (config.p_elapsedTime || 0) / 1000
        }
    }
}
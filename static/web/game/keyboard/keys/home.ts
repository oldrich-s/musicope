import { config, setParam } from "../../../config/config"
import { Song } from "../../song/song"
import { IKeyboardAction } from "../i-actions"

export function home(keyboardActions: { [key: string]: IKeyboardAction }) {
    keyboardActions["home"] = {
        title: "Rewind start",
        description: "Rewind the song back to the initial position.",
        triggerAction: (song: Song) => {
            setParam("p_elapsedTime", config.p_initTime)
        },
        getCurrentState: () => {
            return (config.p_elapsedTime || 0) / 1000
        }
    }

}
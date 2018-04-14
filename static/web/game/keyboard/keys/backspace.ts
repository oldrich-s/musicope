import { Song } from "../../song/song"
import { IKeyboardAction } from "../i-actions"
import { mainView } from "../../../app"

export function backspace(keyboardActions: { [key: string]: IKeyboardAction }) {
    keyboardActions["backspace"] = {
        title: "Exit",
        description: "Exit the gameplay.",
        triggerAction: (song: Song) => {
            window.close()
        },
        getCurrentState: () => {
            return null
        }
    }

}

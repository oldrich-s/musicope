import { Song } from "../../song/song";
import { IKeyboardAction } from "../i-actions";

export function backspace(keyboardActions: { [key: string]: IKeyboardAction }) {
    keyboardActions["backspace"] = {
        title: "Exit",
        description: "Exit the gameplay.",
        triggerAction: (song: Song) => {
            mainView.router.back();
        },
        getCurrentState: () => {
            return null;
        }
    };

}

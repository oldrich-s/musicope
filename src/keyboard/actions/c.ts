import { Song } from "../../song/song";
import { toggle } from "../tools";
import { config, setParam } from "../../config/config";
import { IKeyboardAction } from "../i-actions";

export function c(keyboardActions: { [key: string]: IKeyboardAction }) {
    var states = [0.0, 0.2, 0.4, 0.6, 0.8];
    keyboardActions["c"] = {
        title: "Cover notes",
        description: "Cover a part of the note bars to increase the difficulty level.",
        triggerAction: (song: Song) => {
            var height: number = toggle(config.s_noteCoverRelHeight, states);
            setParam("s_noteCoverRelHeight", height);
        },
        getCurrentState: () => {
            return config.s_noteCoverRelHeight;
        }
    };
}
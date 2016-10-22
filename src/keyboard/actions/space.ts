import { Song } from "../../song/song";
import { config, setParam } from "../../config/config";
import { IKeyboardAction } from "../i-actions";

export function space(keyboardActions: { [key: string]: IKeyboardAction }) {
    keyboardActions["space"] = {
        title: "Pause",
        description: "Pause / unpause the song playback.",
        triggerAction: (song: Song) => {
            setParam("p_isPaused", !config.p_isPaused);
        },
        getCurrentState: () => {
            return config.p_isPaused ? "on" : "off";
        }
    };
}
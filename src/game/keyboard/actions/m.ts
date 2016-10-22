import { config, setParam } from "../../../config/config";
import { Song } from "../../song/song";
import { IKeyboardAction } from "../i-actions";

export function m(keyboardActions: { [key: string]: IKeyboardAction }) {
    keyboardActions["m"] = {
        title: "Metronome",
        description: "Toggle state of the metronome on/off",
        triggerAction: (song: Song) => {
            setParam("m_isOn", !config.m_isOn);
        },
        getCurrentState: () => {
            return config.m_isOn ? "on" : "off";
        }
    };
}
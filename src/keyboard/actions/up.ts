import { Song } from "../../song/song";
import { config, setParam } from "../../config/config";
import { IKeyboardAction } from "../i-actions";

export function up(keyboardActions: { [key: string]: IKeyboardAction }) {
    keyboardActions["up"] = {
        title: "Speed up",
        description: "Speed up the playback by 10 percent points.",
        triggerAction: (song: Song) => {
            setParam("p_speed", config.p_speed + 0.1);
        },
        getCurrentState: () => {
            return config.p_speed * 100;
        }
    };
}
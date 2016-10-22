import { config, setParam } from "../../../config/config";
import { toggle } from "../tools";
import { Song } from "../../song/song";
import { IKeyboardAction } from "../i-actions";

export function p(keyboardActions: { [key: string]: IKeyboardAction }) {
    var options = [0, 1, 0.7, 1.3];

    keyboardActions["p"] = {
        title: "Play all hands",
        description: "Always play all notes.",
        triggerAction: (song: Song) => {
            setParam("p_playAllHands", toggle(config.p_playAllHands, options));
        },
        getCurrentState: () => {
            var i = options.indexOf(config.p_playAllHands);
            return options[i];
        }
    };
}
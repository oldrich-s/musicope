import { config, setParam } from "../../../config/config";
import { Song } from "../../song/song";
import { toggle } from "../tools";
import { IKeyboardAction } from "../i-actions";

export function w(keyboardActions: { [key: string]: IKeyboardAction }) {
    var options = [[false, false], [true, true]];
    var names = ["off", "on"];

    keyboardActions["w"] = {
        title: "Wait",
        description: "The song playback stops until the correct note is hit.",
        triggerAction: (song: Song) => {
            setParam("p_waits", toggle(config.p_waits, options));
        },
        getCurrentState: () => {
            var i = options.indexOf(config.p_waits);
            return names[i];
        }
    };
}
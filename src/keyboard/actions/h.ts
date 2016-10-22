import { toggle } from "../tools";
import { Song } from "../../song/song";
import { config, setParam } from "../../config/config";
import { IKeyboardAction } from "../i-actions";

export function h(keyboardActions: { [key: string]: IKeyboardAction }) {
    var options = [[false, false], [false, true], [true, false], [true, true]];
    var names = ["none", "right", "left", "both"];

    keyboardActions["h"] = {
        title: "Hands",
        description: "Defines which hands are played by the user [no hands / right hand / left hand / both hands].",
        triggerAction: (song: Song) => {
            setParam("p_userHands", toggle(config.p_userHands, options));
        },
        getCurrentState: () => {
            var i = options.indexOf(config.p_userHands);
            return names[i];
        }
    };
}
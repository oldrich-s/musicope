import { Song } from "../../song/song";
import { config, setParam } from "../../config/config";
import { IKeyboardAction } from "../i-actions";

export function l(keyboardActions: { [key: string]: IKeyboardAction }) {
    var names = ["Reset", "Start defined", "End defined"];

    var state = 0;

    keyboardActions["l"] = {
        title: "Loop",
        description: "Define start / stop loop and erase.",
        triggerAction: (song: Song) => {
            var keys = Object.keys(song.midi.signatures).sort((a, b) => Number(b) - Number(a));
            var fkeys = keys.filter((s) => { return Number(s) < config.p_elapsedTime; });
            var key = Number(fkeys.length == 0 ? keys[keys.length - 1] : fkeys[0]);
            var n = (config.p_elapsedTime - key) / song.midi.signatures[key].msecsPerBar;
            if (state === 0) {
                var startTime = key + Math.floor(n + 0.01) * song.midi.signatures[key].msecsPerBar - 20;
                setParam("p_loopStart", startTime);
                state = state + 1;
            } else if (state === 1) {
                var endTime = key + Math.ceil(n + 0.01) * song.midi.signatures[key].msecsPerBar;
                setParam("p_loopEnd", endTime);
                state = state + 1;
            } else {
                setParam("p_loopStart", null);
                setParam("p_loopEnd", null);
                state = 0;
            }
        },
        getCurrentState: () => {
            return names[state];
        }
    };

}
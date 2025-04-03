import { config, setParam } from "../../../config/config"
import { Song } from "../../song/song"
import { toggle } from "../tools"
import { IKeyboardAction } from "../i-actions"
import { webMidi } from "../../../web-midi/web-midi"
import { FromDevice } from "../../player/from-device"

export function i(keyboardActions: { [key: string]: IKeyboardAction }) {
    keyboardActions["i"] = {
        title: "Change device",
        description: "Alternate through midi devices",
        triggerAction: (song: Song) => {
            var midi = webMidi.midi
            const inputs = Array.from(midi.inputs.values())
            var device = parseInt(config.p_deviceIn) + 1
            if (device >= inputs.length)
                device = 0

            setParam("p_deviceIn", device.toString())
            webMidi.refresh()
        },
        getCurrentState: () => {
            const inputs = Array.from(webMidi.midi.inputs.values())
            return inputs[config.p_deviceIn].name
        }
    }
}

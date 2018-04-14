import { config } from "../config/config"

class WebMidi {

    ready: Promise<void>

    private midi: any
    private output: any
    private input: any

    constructor() {
        const o = this
        o.ready = new Promise<void>((resolve, reject) => {
            (<any>navigator).requestMIDIAccess().then((m: any) => {
                o.midi = m
                resolve()
            }, (msg: string) => {
                reject("Failed to get MIDI access - " + msg)
            })
        })
    }

    //inList = () => {
    //    return [] //this.midi.inputs
    //}

    //outList = () => {
    //    return [] //this.midi.outputs
    //}

    inOpen = (callback: (timestamp: number, data1: number, data2: number, data3: number) => void) => {
        const o = this
        o.input = o.midi.inputs.get('input-' + config.p_deviceIn)
        if (o.input) {
            o.input.onmidimessage = (e: any) => {
                callback(e.timeStamp, e.data[0], e.data[1], e.data[2])
            }
        }
    }

    outOpen = () => {
        const o = this
        o.output = o.midi.outputs.get('output-' + config.p_deviceOut)
        if (!o.output) {
            o.output = o.midi.outputs.get(0)
        }
    }

    inClose = () => {
        const o = this
        if (o.input && o.input.value) {
            o.input.value.onmidimessage = null
        }
    }

    out = (byte1: number, byte2: number, byte3: number) => {
        const o = this
        if (o.output) {
            const data = [byte1, byte2]
            if (typeof byte3 === "number") {
                data.push(byte3)
            }
            o.output.send(data)
        }
    }

}

export const webMidi = new WebMidi()
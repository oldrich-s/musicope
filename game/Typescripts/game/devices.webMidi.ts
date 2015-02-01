module Musicope.Game.Devices {

    export class WebMidi implements IDevice {

        private midi;
        private output;
        private input;

        constructor() { }

        init = () => {
            var o = this;
            var def = $.Deferred<void>();
            (<any>navigator).requestMIDIAccess().then((m) => {
                o.midi = m;
                def.resolve();
            },(msg) => {
                console.log("Failed to get MIDI access - " + msg);
            });
            return def;
        }

        inOpen = (callback) => {
            var o = this;
            o.input = o.midi.inputs.get(params.p_deviceIn);
            if (o.input) {
                o.input.onmidimessage = (e) => {
                    callback(e.timeStamp, e.data[0], e.data[1], e.data[2]);
                };
            }
        }

        inClose = () => {
            var o = this;
            if (o.input && o.input.value) {
                o.input.value.onmidimessage = null;
            }
        }

        inList = () => {
            return this.midi.inputs;
        }

        exists = () => {
            return this.midi;
        }

        out = (byte1: number, byte2: number, byte3: number) => {
            this.output.send([byte1, byte2, byte3]);
        }

        outClose = () => {
        }

        outList = () => {
            return this.midi.outputs;
        }

        outOpen = () => {
            var o = this;
            o.output = o.midi.outputs.get(params.p_deviceOut);
            if (!o.output) {
                o.output = o.midi.outputs.get(0);
            }
        }

        time = () => {
            return Date.now();
        }

    }

} 
module Musicope.Game.Drivers {

    export class WebMidi implements IDriver {

        ready = $.Deferred<void>();

        private midi;
        private output;
        private input;

        constructor() {
            var o = this;
            (<any>navigator).requestMIDIAccess().then((m) => {
                o.midi = m;
                o.ready.resolve();
            },(msg) => {
                o.ready.reject("Failed to get MIDI access - " + msg);
            });
        }

        inList = () => {
            return this.midi.inputs;
        }

        outList = () => {
            return this.midi.outputs;
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

        outOpen = () => {
            var o = this;
            o.output = o.midi.outputs.get(params.p_deviceOut);
            if (!o.output) {
                o.output = o.midi.outputs.get(0);
            }
        }

        inClose = () => {
            var o = this;
            if (o.input && o.input.value) {
                o.input.value.onmidimessage = null;
            }
        }

        outClose = () => { }

        out = (byte1: number, byte2: number, byte3: number) => {
            var data = [byte1, byte2];
            if (typeof byte3 === "number") {
                data.push(byte3);
            }
            this.output.send(data);
        }

        dispose = () => {
            var o = this;
            o.inClose();
        }

    }

} 
module Musicope.Game {

    export class Controller {

        private device: Devices.IDevice;
        private input: IInput;
        private metronome: Metronome;
        private song: Song;
        private player: Player;
        private scene: Scene;

        constructor() {
            var o = this;
            $('#listView').hide();
            $('#gameView').show();
            if (!params.c_songUrl) { throw "c_songUrl does not exist!"; }
            else {
                o.device = new Devices[params.c_device]();
                o.device.init().done(() => {
                    if (!o.device.exists()) {
                        throw "Device does not exist!"
                    } else {
                        o.getSong().done((arr: Uint8Array) => {
                            o.init(arr);
                        });
                    }
                });
            }
        }

        private getSong() {
            var o = this;
            var out = $.Deferred();
            dropbox.readFile(params.c_songUrl, { arrayBuffer: true }, function (error, data) {
                var arr = new Uint8Array(data);
                out.resolve(arr);
            });
            return out.promise();
        }

        private init(arr: Uint8Array): void {
            var o = this;
            o.song = new Song(arr);
            o.scene = new Scene(o.song);
            o.metronome = new Metronome(o.song.timePerBeat, o.song.timePerBar / o.song.timePerBeat, o.device);
            o.player = new Player(o.device, o.song, o.metronome, o.scene);
            for (var prop in Inputs) {
                if ((<string>prop).indexOf("Fns") < 0) {
                    new (<IInputNew> (<any>Inputs)[prop])(o.song);
                }
            }
            o.step();
        }

        private step() {
            var o = this;
            var isEnd = false;
            function _step() {
                if (!isEnd && $('.canvas').is(':visible')) {
                    o.requestAnimationFrame.call(window, _step);
                    isEnd = o.player.step();
                }
            }
            _step();
        }

        private requestAnimationFrame: (fn: () => void) => void =
        window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] ||
        window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] ||
        window["msRequestAnimationFrame"] || function (callback) { window.setTimeout(callback, 1000 / 60); };

    }

} 
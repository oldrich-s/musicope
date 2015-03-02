module Musicope.Game {

    export class Game implements IDisposable {

        private driver: IDriver;
        private keyboard: Keyboard;
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
                o.driver = new Drivers[params.c_driver]();
                o.driver.ready.done(() => {
                    o.getSong().done((arr: Uint8Array) => {
                        o.init(arr);
                    });
                });
            }
        }

        dispose = () => {
            var o = this;
            o.driver.dispose();
            o.metronome.dispose();
            o.player.dispose();
            o.scene.dispose();
            o.keyboard.dispose();
        }

        private getSong() {
            var o = this;
            var out = $.Deferred();
            dropbox.readFile(params.c_songUrl, { arrayBuffer: true }, function (error, data) {
                var arr = new Uint8Array(data);
                if (error || arr.length == 0) {
                    throw "error loading midi file";
                }
                out.resolve(arr);
            });
            return out.promise();
        }

        private init(arr: Uint8Array): void {
            var o = this;
            o.song = new Song(arr);
            o.scene = new Scene(o.song);
            o.metronome = new Metronome(o.song.midi.timePerBeat, o.song.midi.timePerBar / o.song.midi.timePerBeat, o.driver);
            o.player = new Player(o.driver, o.song, o.metronome, o.scene);
            o.keyboard = new Keyboard(o.song);
            o.step();
        }

        private step() {
            var o = this;
            function _step() {
                if ($('.canvas').is(':visible')) {
                    o.requestAnimationFrame.call(window, _step);
                    o.player.step();
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
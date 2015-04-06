module Musicope.Game {

    export class Game {

        private keyboard: Keyboard;
        private metronome: Metronome;
        private song: Song;
        private player: Player;
        private scene: Scene;

        constructor() {
            var o = this;

            $('#listView').hide();
            $('#gameView').show();
            if (!config.c_songUrl) { throw "c_songUrl does not exist!"; }
            else {
                webMidi.ready.done(() => {
                    o.init(o.getSong());
                });
            }
        }

        private getSong() {
            var o = this;
            var data = fs.readFileSync(config.c_songUrl);
            var arr = new Uint8Array(data);
            if (arr.length == 0) {
                throw "error loading midi file";
            }
            return arr;
        }

        private init(arr: Uint8Array): void {
            var o = this;
            o.song = new Song(arr);
            o.scene = new Scene(o.song);
            o.metronome = new Metronome(o.song.midi.timePerBeat, o.song.midi.timePerBar / o.song.midi.timePerBeat);
            o.player = new Player(o.song, o.metronome, o.scene);
            o.keyboard = new Keyboard(o.song);
            o.step();
        }

        private step() {
            var o = this;
            function _step() {
                if ($('.canvas').is(':visible')) {
                    o.requestAnimationFrame.call(window, _step);
                    o.player.step();
                } else {
                    webMidi.inClose();
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
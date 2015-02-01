module Musicope.Game {

    export class Player {

        private previousTime: number;
        private playNotes: PlayerFns.PlayNotes;
        private playSustains: PlayerFns.PlaySustains;
        private waitForNote: PlayerFns.WaitForNote;
        private fromDevice: PlayerFns.FromDevice;

        constructor(private device: Devices.IDevice, private song: Song, private metronome: Metronome, private scene: Scene) {
            var o = this;
            o = this;
            o.correctTimesInParams();
            o.subscribeToParamsChange();
            o.assignClasses();
        }

        step = () => {
            var o = this;
            o.playNotes.play();
            o.playSustains.play();
            o.metronome.play(params.p_elapsedTime);
            o.scene.redraw(params.p_elapsedTime, params.p_isPaused);
            var isFreeze = o.waitForNote.isFreeze();
            o.hideTimeBarIfStops(isFreeze);
            return o.updateTime(isFreeze);
        }

        private correctTimesInParams = () => {
            var o = this;
            if (typeof params.p_initTime == 'undefined') {
                Params.setParam("p_initTime", -2 * o.song.timePerBar);
            }
            if (typeof params.p_elapsedTime == 'undefined') {
                Params.setParam("p_elapsedTime", params.p_initTime);
            }
        }

        private subscribeToParamsChange = () => {
            var o = this;
            Params.subscribe("players.Basic", "^p_elapsedTime$",(name, value) => {
                o.reset();
            });
        }

        private reset = () => {
            var o = this;
            o.scene.unsetAllActiveIds();
            o.metronome.reset();
            var idsBelowCurrentTime = o.getIdsBelowCurrentTime();
            o.waitForNote.reset(idsBelowCurrentTime);
            o.playNotes.reset(idsBelowCurrentTime);
            o.deviceOnNotesToOff();
        }

        private deviceOnNotesToOff = () => {
            var o = this;
            for (var i = 0; i < 128; i++) {
                o.device.out(144, i, 0);
            }
        }

        private getIdsBelowCurrentTime = (): number[]=> {
            var o = this;
            return o.song.playerTracks.map(o.getIdBelowCurrentTime);
        }

        private getIdBelowCurrentTime = (notes: Parsers.INote[]) => {
            var o = this;
            if (notes.length > 0) {
                var id = notes.length - 1;
                while (id >= 0 && notes[id] && notes[id].time > params.p_elapsedTime) {
                    id--;
                }
                return id;
            }
        }

        private assignClasses = () => {
            var o = this;
            o.fromDevice = new PlayerFns.FromDevice(o.device, o.scene, o.song.playerTracks);
            o.playNotes = new PlayerFns.PlayNotes(o.device, o.scene, o.song.playerTracks);
            o.playSustains = new PlayerFns.PlaySustains(o.device, o.song.sustainNotes);
            o.waitForNote = new PlayerFns.WaitForNote(o.device, o.song.playerTracks, o.fromDevice.onNoteOn);
        }

        private updateTime = (isFreeze: boolean) => {
            var o = this;
            var currentTime = o.device.time();
            if (!o.previousTime) { o.previousTime = currentTime; }
            var duration = currentTime - o.previousTime;
            o.previousTime = currentTime;

            var isSongEnd = params.p_elapsedTime > o.song.timePerSong + 1000;

            var doFreezeTime =
                isSongEnd ||
                params.p_isPaused ||
                isFreeze || /*waiting for hands*/
                duration > 100; /*window was out of focus*/

            if (!doFreezeTime) {
                var newElapsedTime = params.p_elapsedTime + params.p_speed * duration;
                Params.setParam("p_elapsedTime", newElapsedTime, true);
            }

            return isSongEnd;
        }

        private hideTimeBarIfStops = (isFreeze: boolean) => {
            var o = this;
            if (isFreeze) {
                o.scene.setActiveId(2);
                o.scene.setActiveId(1);
            } else {
                o.scene.unsetActiveId(2);
                o.scene.unsetActiveId(1);
            }
        }

    }

} 
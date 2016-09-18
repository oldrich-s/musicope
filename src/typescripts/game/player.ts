module Musicope.Game {

    function hideTimeBarIfStops(scene: Scene, isFreeze: boolean) {
        if (isFreeze) {
            scene.setActiveId(2);
            scene.setActiveId(1);
        } else {
            scene.unsetActiveId(2);
            scene.unsetActiveId(1);
        }
    }

    function driverOnNotesToOff() {
        for (var i = 0; i < 128; i++) {
            webMidi.out(144, i, 0);
        }
    }

    function getIdBelowCurrentTime(notes: Parsers.INote[]) {
        if (notes.length > 0) {
            var id = notes.length - 1;
            while (id >= 0 && notes[id] && notes[id].time > config.p_elapsedTime) {
                id--;
            }
            return id;
        }
    }

    function getIdsBelowCurrentTime(playerTracks: Parsers.INote[][]) {
        return playerTracks.map(getIdBelowCurrentTime);
    }

    function correctTimesInParams(timePerBar: number) {
        if (typeof config.p_initTime == 'undefined') {
            Params.setParam("p_initTime", -2 * timePerBar);
        }
        if (typeof config.p_elapsedTime == 'undefined') {
            Params.setParam("p_elapsedTime", config.p_initTime);
        }
    }

    export class Player {

        private previousTime: number;
        private playNotes: PlayerFns.PlayNotes;
        private playSustains: PlayerFns.PlaySustains;
        private waitForNote: PlayerFns.WaitForNote;
        private fromDevice: PlayerFns.FromDevice;

        constructor(private song: Song, private metronome: Metronome, private scene: Scene) {
            var o = this;
            o = this;
            correctTimesInParams(o.song.midi.signatures[0].msecsPerBar);
            o.subscribeToParamsChange();
            o.assignClasses();
        }

        step = () => {
            var o = this;
            o.playNotes.play();
            o.playSustains.play();
            o.metronome.play(config.p_elapsedTime);
            o.scene.redraw(config.p_elapsedTime, config.p_isPaused);
            var isFreeze = o.waitForNote.isFreeze();
            hideTimeBarIfStops(o.scene, isFreeze);
            o.waitForNote.modifySpeed();
            return o.updateTime(isFreeze);
        }

        private subscribeToParamsChange = () => {
            var o = this;
            Params.subscribe("players.Basic", "^p_elapsedTime$", (name, value) => {
                o.reset();
            });
        }

        private reset = () => {
            var o = this;
            o.scene.unsetAllActiveIds();
            o.metronome.reset();
            var idsBelowCurrentTime = getIdsBelowCurrentTime(o.song.midi.tracks);
            o.waitForNote.reset(idsBelowCurrentTime);
            o.playNotes.reset(idsBelowCurrentTime);
            driverOnNotesToOff();
        }

        private assignClasses = () => {
            var o = this;
            o.fromDevice = new PlayerFns.FromDevice(o.scene, o.song.midi.tracks);
            o.playNotes = new PlayerFns.PlayNotes(o.scene, o.song.midi.tracks);
            o.playSustains = new PlayerFns.PlaySustains(o.song.midi.sustainNotes);
            o.waitForNote = new PlayerFns.WaitForNote(o.song.midi.tracks, o.fromDevice.onNoteOn);
        }

        private updateTime = (isFreeze: boolean) => {
            var o = this;
            var currentTime = Date.now();
            if (!o.previousTime) { o.previousTime = currentTime; }
            var duration = currentTime - o.previousTime;
            o.previousTime = currentTime;

            var isSongEnd = config.p_elapsedTime > o.song.timePerSong + 1000;

            var doFreezeTime =
                isSongEnd ||
                config.p_isPaused ||
                isFreeze || /*waiting for hands*/
                duration > 100; /*window was out of focus*/

            if (!doFreezeTime) {
                var newElapsedTime = config.p_elapsedTime + config.p_speed * duration;
                if (config.p_loopEnd !== null && newElapsedTime > config.p_loopEnd) {
                    newElapsedTime = config.p_loopStart;
                    Params.setParam("p_elapsedTime", newElapsedTime);
                } else {
                    Params.setParam("p_elapsedTime", newElapsedTime, true);
                }
            }

            return isSongEnd;
        }

    }

} 
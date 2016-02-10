module Musicope.Game.PlayerFns {

    export class PlayNotes {

        private ids: number[];

        constructor(private scene: Scene, private notes: Parsers.INote[][]) {
            var o = this;
            o.assignIds();
        }

        play = () => {
            var o = this;
            for (var trackId = 0; trackId < o.notes.length; trackId++) {
                while (o.isIdBelowCurrentTime(trackId)) {
                    var note = o.notes[trackId][o.ids[trackId]];
                    if (!o.isIdWayTooBelowCurrentTime(trackId)) {
                        o.playNote(note, trackId);
                    }
                    o.ids[trackId]++;
                }
            }
        }

        reset = (idsBelowCurrentTime: number[]) => {
            var o = this;
            for (var i = 0; i < idsBelowCurrentTime.length; i++) {
                o.ids[i] = Math.max(0, idsBelowCurrentTime[i]);
            }
        }

        private assignIds = () => {
            var o = this;
            o.ids = o.notes.map(() => { return 0; });
        }

        private isIdBelowCurrentTime = (trackId: number) => {
            var o = this;
            return o.notes[trackId][o.ids[trackId]] &&
                o.notes[trackId][o.ids[trackId]].time < config.p_elapsedTime;
        }

        private isIdWayTooBelowCurrentTime = (trackId: number) => {
            var o = this;
            return o.notes[trackId][o.ids[trackId]] &&
                o.notes[trackId][o.ids[trackId]].time < config.p_elapsedTime - 100;
        }

        private playNote = (note: Parsers.INote, trackId: number) => {
            var o = this;
            if (!config.p_userHands[trackId] || o.playOutOfReach(note)) {
                if (note.on) {
                    webMidi.out(144, note.id, Math.min(127, o.getVelocity(trackId, note)));
                    o.scene.setActiveId(note.id);
                } else {
                    webMidi.out(144, note.id, 0);
                    o.scene.unsetActiveId(note.id);
                }
            } else if (config.p_playAllHands) {
                if (note.on) {
                    var velocity = Math.min(127, config.p_playAllHands * note.velocity);
                    webMidi.out(144, note.id, velocity);
                } else {
                    webMidi.out(144, note.id, 0);
                }
            }
        }

        private playOutOfReach = (note: Parsers.INote) => {
            var o = this;
            var isBelowMin = note.id < config.p_minNote;
            var isAboveMax = note.id > config.p_maxNote;
            return config.p_playOutOfReachNotes && (isBelowMin || isAboveMax);
        }

        private getVelocity = (trackId: number, note: Parsers.INote) => {
            var o = this;
            var velocity = config.p_volumes[trackId] * note.velocity;
            var maxVelocity = config.p_maxVelocity[trackId];
            if (maxVelocity && velocity > maxVelocity) {
                velocity = maxVelocity;
            }
            return velocity;
        }

    }

} 
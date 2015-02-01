module Musicope.Game.PlayerFns {

    export class PlayNotes {

        private ids: number[];

        constructor(private device: Devices.IDevice,
            private scene: Scene,
            private notes: Parsers.INote[][]) {
            var o = this;
            o = this;
            o.assignIds();
        }

        play = () => {
            var o = this;
            for (var trackId = 0; trackId < o.notes.length; trackId++) {
                while (o.isIdBelowCurrentTime(trackId)) {
                    var note = o.notes[trackId][o.ids[trackId]];
                    o.playNote(note, trackId);
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
                o.notes[trackId][o.ids[trackId]].time < params.p_elapsedTime;
        }

        private playNote = (note: Parsers.INote, trackId: number) => {
            var o = this;
            var playsUser = params.p_userHands[trackId];
            if (!playsUser || o.playOutOfReach(note)) {
                if (note.on) {
                    o.device.out(144, note.id, Math.min(127, o.getVelocity(trackId, note)));
                    o.scene.setActiveId(note.id);
                } else {
                    o.device.out(144, note.id, 0);
                    o.scene.unsetActiveId(note.id);
                }
            }
        }

        private playOutOfReach = (note: Parsers.INote) => {
            var o = this;
            var isBelowMin = note.id < params.p_minNote;
            var isAboveMax = note.id > params.p_maxNote;
            params.p_playOutOfReachNotes && (isBelowMin || isAboveMax);
        }

        private getVelocity = (trackId: number, note: Parsers.INote) => {
            var o = this;
            var velocity = params.p_volumes[trackId] * note.velocity;
            var maxVelocity = params.p_maxVelocity[trackId];
            if (maxVelocity && velocity > maxVelocity) {
                velocity = maxVelocity;
            }
            return velocity;
        }

    }

} 
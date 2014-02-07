module Musicope.Game.Players.BasicFns {

  var o: PlayNotes;

  export class PlayNotes {

    private ids: number[];

    constructor(private device: Devices.IDevice,
      private scene: Scenes.IScene,
      private params: Params.IParams,
      private notes: Parsers.INote[][]) {
      o = this;
      o.assignIds();
    }

    play() {
      for (var trackId = 0; trackId < o.notes.length; trackId++) {
        while (o.isIdBelowCurrentTime(trackId)) {
          var note = o.notes[trackId][o.ids[trackId]];
          o.playNote(note, trackId);
          o.ids[trackId]++;
        }
      }
    }

    reset(idsBelowCurrentTime: number[]) {
      for (var i = 0; i < idsBelowCurrentTime.length; i++) {
        o.ids[i] = Math.max(0, idsBelowCurrentTime[i]);
      }
    }

    private assignIds() {
      o.ids = o.notes.map(() => { return 0; });
    }

    private isIdBelowCurrentTime(trackId: number) {
      return o.notes[trackId][o.ids[trackId]] &&
        o.notes[trackId][o.ids[trackId]].time < o.params.readOnly.p_elapsedTime;
    }

    private playNote(note: Parsers.INote, trackId: number) {
      var playsUser = o.params.readOnly.p_userHands[trackId];
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

    private playOutOfReach(note: Parsers.INote) {
      var isBelowMin = note.id < o.params.readOnly.p_minNote;
      var isAboveMax = note.id > o.params.readOnly.p_maxNote;
      o.params.readOnly.p_playOutOfReachNotes && (isBelowMin || isAboveMax);
    }

    private getVelocity(trackId: number, note: Parsers.INote) {
      var velocity = o.params.readOnly.p_volumes[trackId] * note.velocity;
      var maxVelocity = o.params.readOnly.p_maxVelocity[trackId];
      if (maxVelocity && velocity > maxVelocity) {
        velocity = maxVelocity;
      }
      return velocity;
    }

  }

}
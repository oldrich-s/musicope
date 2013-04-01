/// <reference path="../../_references.ts" />

export class PlayNotes {

  private ids = [0, 0];

  constructor(private device: IDevice,
              private scene: IGame.IScene,
              private params: IGame.IParams,
              private notes: IGame.INote[][] ) { }

  play() {
    var o = this;
    for (var trackId = 0; trackId < o.notes.length; trackId++) {
      while (o.isIdBelowCurrentTime(trackId)) {
        var note = o.notes[trackId][o.ids[trackId]];
        o.playNote(note, trackId);
        o.ids[trackId]++;
      }
    }
  }

  reset(idsBelowCurrentTime: number[]) {
    idsBelowCurrentTime.forEach(this.setId);
  }

  private setId(id, i) { this.ids[i] = id; }

  private isIdBelowCurrentTime(trackId: number) {
    var o = this;
    return o.notes[trackId][o.ids[trackId]] &&
           o.notes[trackId][o.ids[trackId]].time < o.params.readOnly.p_elapsedTime;
  }

  private playNote(note: IGame.INote, trackId: number) {
    var o = this;
    var playsUser = o.params.readOnly.p_userHands[trackId];
    var isBelowMin = note.id < o.params.readOnly.p_minNote;
    var isAboveMax = note.id > o.params.readOnly.p_maxNote;
    var playOutOfReach = o.params.readOnly.p_playOutOfReachNotes && (isBelowMin || isAboveMax);
    if (!playsUser || playOutOfReach) {
      if (note.on) {
        var velocity = o.params.readOnly.p_volumes[trackId] * note.velocity;
        var maxVelocity = o.params.readOnly.p_maxVelocity[trackId];
        if (maxVelocity && velocity > maxVelocity) {
          velocity = maxVelocity;
        }
        o.device.out(144, note.id, Math.min(127, velocity));
        o.scene.setActiveId(note.id);
      } else {
        o.device.out(144, note.id, 0);
        o.scene.unsetActiveId(note.id);
      }
    }
  }

}
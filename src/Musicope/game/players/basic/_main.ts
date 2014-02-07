module Musicope.Game.Players.Basic {

  var o: Basic;

  export class Basic implements IPlayer {

    private previousTime: number;
    private playNotes: BasicFns.PlayNotes;
    private playSustains: BasicFns.PlaySustains;
    private waitForNote: BasicFns.WaitForNote;
    private fromDevice: BasicFns.FromDevice;

    constructor(private device: Devices.IDevice, private song: Songs.ISong, private metronome: Metronomes.IMetronome,
      private scene: Scenes.IScene, private params: Params.IParams) {
      o = this;
      o.correctTimesInParams();
      o.subscribeToParamsChange();
      o.assignClasses();
    }

    step() {
      o.playNotes.play();
      o.playSustains.play();
      o.metronome.play(o.params.readOnly.p_elapsedTime);
      o.scene.redraw(o.params.readOnly.p_elapsedTime, o.params.readOnly.p_isPaused);
      var isFreeze = o.waitForNote.isFreeze();
      o.hideTimeBarIfStops(isFreeze);
      return o.updateTime(isFreeze);
    }

    private correctTimesInParams() {
      if (typeof o.params.readOnly.p_initTime == 'undefined') {
        o.params.setParam("p_initTime", -2 * o.song.timePerBar);
      }
      if (typeof o.params.readOnly.p_elapsedTime == 'undefined') {
        o.params.setParam("p_elapsedTime", o.params.readOnly.p_initTime);
      }
    }

    private subscribeToParamsChange() {
      o.params.subscribe("players.Basic", "^p_elapsedTime$", (name, value) => {
        o.reset();
      });
    }

    private reset() {
      o.scene.unsetAllActiveIds();
      o.metronome.reset();
      var idsBelowCurrentTime = o.getIdsBelowCurrentTime();
      o.waitForNote.reset(idsBelowCurrentTime);
      o.playNotes.reset(idsBelowCurrentTime);
      o.deviceOnNotesToOff();
    }

    private deviceOnNotesToOff() {
      var o = this;
      for (var i = 0; i < 128; i++) {
        o.device.out(144, i, 0);
      }
    }

    private getIdsBelowCurrentTime(): number[] {
      return o.song.playerTracks.map(o.getIdBelowCurrentTime);
    }

    private getIdBelowCurrentTime(notes: Parsers.INote[]) {
      if (notes.length > 0) {
        var id = notes.length - 1;
        while (id >= 0 && notes[id] && notes[id].time > o.params.readOnly.p_elapsedTime) {
          id--;
        }
        return id;
      }
    }

    private assignClasses() {
      o.fromDevice = new BasicFns.FromDevice(o.device, o.scene, o.params, o.song.playerTracks);
      o.playNotes = new BasicFns.PlayNotes(o.device, o.scene, o.params, o.song.playerTracks);
      o.playSustains = new BasicFns.PlaySustains(o.device, o.params, o.song.sustainNotes);
      o.waitForNote = new BasicFns.WaitForNote(o.device, o.params, o.song.playerTracks, o.fromDevice.onNoteOn);
    }

    private updateTime(isFreeze: boolean) {
      var currentTime = o.device.time();
      if (!o.previousTime) { o.previousTime = currentTime; }
      var duration = currentTime - o.previousTime;
      o.previousTime = currentTime;

      var isSongEnd = o.params.readOnly.p_elapsedTime > o.song.timePerSong + 1000;

      var doFreezeTime =
        isSongEnd ||
        o.params.readOnly.p_isPaused ||
        isFreeze || /*waiting for hands*/
        duration > 100; /*window was out of focus*/

      if (!doFreezeTime) {
        var newElapsedTime = o.params.readOnly.p_elapsedTime + o.params.readOnly.p_speed * duration;
        o.params.setParam("p_elapsedTime", newElapsedTime, true);
      }

      return isSongEnd;
    }

    private hideTimeBarIfStops(isFreeze: boolean) {
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
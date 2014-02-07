module Musicope.Game.Players.BasicFns {

  var o: FromDevice;

  export class FromDevice {

    private noteOnFuncs = [];

    private oldTimeStamp = -1;
    private oldVelocity = -1;
    private oldId = -1;

    constructor(private device: Devices.IDevice,
      private scene: Scenes.IScene,
      private params: Params.IParams,
      private notes: Parsers.INote[][]) {
      o = this;
      o.initDevice();
    }

    private initDevice() {
      var midiOut = o.params.readOnly.p_deviceOut;
      var midiIn = o.params.readOnly.p_deviceIn;
      o.device.outOpen(midiOut);
      o.device.out(0x80, 0, 0);
      o.device.inOpen(midiIn, o.deviceIn);
    }

    onNoteOn(func: (noteId: number) => void) {
      o.noteOnFuncs.push(func);
    }

    private deviceIn(timeStamp, kind, noteId, velocity) {
      o.sendBackToDevice(kind, noteId, velocity);
      var isNoteOn = kind === 144 && velocity > 0;
      var isNoteOff = kind === 128 || (kind === 144 && velocity == 0);
      if (isNoteOn && !o.isDoubleNote(timeStamp, isNoteOn, noteId, velocity)) {
        console.log(timeStamp + " " + kind + " " + noteId + " " + velocity);
        o.scene.setActiveId(noteId);
        o.execNoteOnFuncs(noteId);
      } else if (isNoteOff) {
        o.scene.unsetActiveId(noteId);
      }
    }

    private sendBackToDevice(kind, noteId, velocity) {
      if (kind < 242 && (kind < 127 || kind > 160)) {
        o.device.out(kind, noteId, velocity);
      }
    }

    private isDoubleNote(timeStamp: number, isNoteOn: boolean, noteId: number, velocity: number) {
      var isSimilarTime = Math.abs(timeStamp - o.oldTimeStamp) < 3;
      var idMaches = Math.abs(noteId - o.oldId) == 12 || Math.abs(noteId - o.oldId) == 24;
      var isDoubleNote = isSimilarTime && idMaches && velocity == o.oldVelocity;
      o.oldTimeStamp = timeStamp;
      o.oldVelocity = velocity;
      o.oldId = noteId;
      return isDoubleNote;
    }

    private execNoteOnFuncs(noteId: number) {
      for (var i = 0; i < o.noteOnFuncs.length; i++) {
        o.noteOnFuncs[i](noteId);
      }
    }

  }

}
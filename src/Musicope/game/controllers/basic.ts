module Musicope.Game.Controllers {

  export class Basic implements IController {

    private device: Devices.IDevice;
    private input: IInput;
    private metronome: Metronomes.IMetronome;
    private song: Songs.ISong;
    private player: Players.IPlayer;
    private scene: Scenes.IScene;

    private params: Params.IParams;

    constructor() {
      var o = this;

      o.params = new Params.Basic();

      if (!o.params.readOnly.c_songUrl) { throw "c_songUrl does not exist!"; }
      else {
        o.device = new (<Devices.IDeviceNew> (<any>Devices)[o.params.readOnly.c_idevice])();
        if (!o.device.exists()) {
        throw "Device does not exist!"
      } else {
          o.getSong().done((arr: Uint8Array) => {
            o.init(arr);
          });
        }
      }
    }

    private getSong() {
      var o = this;
      var out = $.Deferred();
      var isLocal = o.params.readOnly.c_songUrl.indexOf("../") == 0;
      if (isLocal) {
        return o.getSongLocal();
      } else {
        return o.getSongRemote();
      }
    }

    private getSongLocal() {
      var o = this;
      var out = $.Deferred();
      var xhr = new XMLHttpRequest();
      xhr.open('GET', o.params.readOnly.c_songUrl);
      xhr.responseType = 'arraybuffer';

      xhr.onload = function (e) {
        if (this.status == 200) {
          var arr = new Uint8Array(xhr.response);
          out.resolve(arr);

        }
      }
    xhr.send();
      return out.promise();
    }

    private getSongRemote() {
      var o = this;
      var out = $.Deferred();
      var url = "../proxy.php?url=" + encodeURIComponent(o.params.readOnly.c_songUrl);
      $.get(url).done((text: string) => {
        var arr = atob(text);
        out.resolve(arr);
      });
      return out;
    }

    private init(arr: Uint8Array): void {
      var o = this;
      o.song = new (<Songs.ISongNew> (<any>Songs)[o.params.readOnly.c_iparser])(arr, o.params);
      o.scene = new (<Scenes.ISceneNew> (<any>Scenes)[o.params.readOnly.c_iscene])(o.song, o.params);
      o.metronome = new Metronomes.Basic(o.song.timePerBeat, o.song.timePerBar / o.song.timePerBeat, o.device, o.params);
      o.player = new (<Players.IPlayerNew> (<any>Players)[o.params.readOnly.c_iplayer])(o.device, o.song, o.metronome, o.scene, o.params);
      for (var prop in Inputs) {
        if ((<string>prop).indexOf("Fns") < 0) {
          new (<IInputNew> (<any>Inputs)[prop])(o.params, o.song);
        }
      }
      o.step();
    }

    private step() {
      var o = this;
      var isEnd = false;
      function _step() {
        if (o.params.readOnly.c_callbackUrl && isEnd) {
          o.redirect();
        } else {
          o.requestAnimationFrame.call(window, _step);
          isEnd = o.player.step();
        }
      }
      _step();
    }

    private requestAnimationFrame: (fn: () => void) => void =
    window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] ||
    window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] ||
    window["msRequestAnimationFrame"] || function (callback) { window.setTimeout(callback, 1000 / 60); };

    private redirect() {
      var o = this;
      window.location.href = o.params.readOnly.c_callbackUrl;
    }

  }

}
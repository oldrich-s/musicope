/// <reference path="../../_references.ts" />

import paramsM = module("../../_params/_load");
import devicesM = module("../../../common/devices/_load");
import inputsM = module("../../inputs/_load");
import metronomesM = module("../../metronomes/_load");
import songsM = module("../../songs/_load");
import playersM = module("../../players/_load");
import scenesM = module("../../scenes/_load");

import benchmarkM = module("../../../common/benchmark/_main");
var benchmark = new benchmarkM.Benchmark();

export class Basic implements IGame.IController {

  private device: IDevice;
  private input: IGame.IInput;
  private metronome: IGame.IMetronome;
  private song: IGame.ISong;
  private player: IGame.IPlayer;
  private scene: IGame.IScene;

  private params: IGame.IParams;

  constructor() {
    var o = this;

    o.params = new paramsM.Basic();

    if (!o.params.readOnly.c_songUrl) { throw "c_songUrl does not exist!"; }
    else {
      o.device = new (<IDeviceNew> devicesM[o.params.readOnly.c_idevice])();
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
    return out;
  }

  private init(arr: Uint8Array): void {
    var o = this;
    o.song = new (<IGame.ISongNew> songsM[o.params.readOnly.c_iparser])(arr, o.params);
    o.scene = new (<IGame.ISceneNew> scenesM[o.params.readOnly.c_iscene])(o.song, o.params);
    o.metronome = new metronomesM.Basic(o.song.timePerBeat, o.song.timePerBar / o.song.timePerBeat, o.device, o.params);
    o.player = new (<IGame.IPlayerNew> playersM[o.params.readOnly.c_iplayer])(o.device, o.song, o.metronome, o.scene, o.params);
    for (var prop in inputsM) {
      new (<IGame.IInputNew> inputsM[prop])(o.params, o.song);
    }
    o.step();
  }

  private step() {
    var o = this;
    function _step() {
      var isEnd = o.player.step();
      if (isEnd && o.params.readOnly.c_callbackUrl) {
        o.redirect();
      } else {
        benchmark.displayFPS();
        o.requestAnimationFrame.call(window, _step);
      }
    }
    _step();
  }

  private requestAnimationFrame: (fn: () => void ) => void =
    window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] ||
    window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] ||
    window["msRequestAnimationFrame"] || function (callback) { window.setTimeout(callback, 1000 / 60); };

  private redirect() {
    var o = this;
    window.location.href = o.params.readOnly.c_callbackUrl;
  }
  
}

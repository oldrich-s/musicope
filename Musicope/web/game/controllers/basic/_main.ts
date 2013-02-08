/// <reference path="../../_references.ts" />

import paramsM = module("../../_params/_load");
import devicesM = module("../../../common/devices/_load");
import inputsM = module("../../inputs/_load");
import metronomesM = module("../../metronomes/_load");
import parsersM = module("../../parsers/_load");
import playersM = module("../../players/_load");
import scenesM = module("../../scenes/_load");

//import benchmarkM = module("./benchmark");
//var benchmark = new benchmarkM.Benchmark();

export class Basic implements IGame.IController {

  private device: IDevice;
  private input: IGame.IInput;
  private metronome: IGame.IMetronome;
  private parser: IGame.IParser;
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
        o.getSong().done((arr) => {
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

  private init(arr: Uint8Array) {
    var o = this;
    o.parser = new (<IGame.IParserNew> parsersM[o.params.readOnly.c_iparser])(arr, o.params);
    o.scene = new (<IGame.ISceneNew> scenesM[o.params.readOnly.c_iscene])(o.parser, o.params);
    o.metronome = new metronomesM.Basic(o.parser.timePerBeat, o.parser.timePerBar / o.parser.timePerBeat, o.device, o.params);
    o.player = new (<IGame.IPlayerNew> playersM[o.params.readOnly.c_iplayer])(o.device, o.parser, o.metronome, o.scene, o.params);
    for (var prop in inputsM) {
      new (<IGame.IInputNew> inputsM[prop])(o.player, o.parser);
    }
  }

  
}

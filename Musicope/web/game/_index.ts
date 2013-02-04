/// <reference path="_references.ts" />

import defParams = module("_paramsDefault");
import paramService = module("../common/services.params");

import devices = module("../common/devices/_load");
import parsers = module("./parsers/_load");
import scenes = module("./scenes/_load");
import players = module("./players/_load");
import inputs = module("./inputs/_load");

var params: IParams = paramService.getUrlParams();
var ctrlParams: ICtrlParams = paramService.copy(params, defParams.iCtrlParams);

if (!ctrlParams.c_songUrl) {
  alert("missing c_songUrl");
} else {

  var device: IDevice = new devices[ctrlParams.c_idevice]();
  device._init();
  if (device.exists()) {
    var parser: IParser = new parsers[ctrlParams.c_iparser]();
    var scene: IScene = new scenes[ctrlParams.c_iscene]();
    var player: IPlayer = new players[ctrlParams.c_iplayer]();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', params.c_songUrl);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
      if (this.status == 200) {
        var arr = new Uint8Array(xhr.response);

        parser._init(arr, params);
        scene._init(parser, params);
        player._init(device, scene, parser, params);
        for (var prop in inputs) {
          (<IGameInput> new inputs[prop]())._init(player, parser);
        }
      }
    }
    xhr.send();
  }
}
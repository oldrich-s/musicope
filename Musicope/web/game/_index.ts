/// <reference path="_references.ts" />

import defParams = module("_paramsDefault");
import paramService = module("../common/services.params");

import devices = module("../common/devices/_load");
import parsers = module("./parsers/_load");
import scenes = module("./scenes/_load");
import players = module("./players/_load");
import inputs = module("./inputs/_load");

var params: IParams = paramService.getUrlParams();
var gameParams: IGameParams = paramService.copy(params, defParams.iCtrlParams);

if (!gameParams.g_songUrl) {
  alert("missing g_songUrl");
} else {

  var device: IDevice = new devices[gameParams.g_idevice]();
  device._init();
  if (device.exists()) {
    var parser: IParser = new parsers[gameParams.g_iparser]();
    var scene: IScene = new scenes[gameParams.g_iscene]();
    var player: IPlayer = new players[gameParams.g_iplayer]();

    var xhr = new XMLHttpRequest();
    xhr.open('GET', params.g_songUrl);
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
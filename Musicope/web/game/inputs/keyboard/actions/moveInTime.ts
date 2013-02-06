/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class MoveInTime implements IKeyboardActions {

  hotkeys = [key.leftArrow, key.rightArrow, key.home];

  constructor(private player: IPlayer, private parser: IParser) { }

  run(keyCode: number) {
    var o = this;
    if (keyCode == key.leftArrow) { o.moveBack(); }
    else if (keyCode == key.rightArrow) { o.moveForward(); }
    else if (keyCode == key.home) { o.goHome(); }
  }

  private moveBack() {
    var o = this;
    o.wrap((params) => {
      var newTime = params.p_elapsedTime - 2 * o.parser.timePerBeat;
      var truncTime = Math.max(params.p_initTime, newTime);
      params.p_elapsedTime = truncTime;
    });
  }

  private moveForward() {
    var o = this;
    o.wrap((params) => {
      var newTime = params.p_elapsedTime + 2 * o.parser.timePerBeat;
      var truncTime = Math.min(o.parser.timePerSong + 10, newTime);
      params.p_elapsedTime = truncTime;
    });
  }

  private goHome() {
    var o = this;
    o.wrap((params) => {
      params.p_elapsedTime = params.p_initTime;
    });
  }

  private wrap(fn: (params: IPlayerParams) => void) {
    var o = this;
    var params = o.player.getParams();
    fn(params);
    o.player.setParams(params);
  }
}
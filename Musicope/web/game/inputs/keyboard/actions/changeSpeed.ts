/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class ChangeSpeed implements IKeyboardActions {

  hotkeys = [key.upArrow, key.downArrow];

  constructor(private player: IPlayer, private parser: IParser) {
    var o = this;
    var params = player.getParams();
    o.changeDisplayedSpeed(params.p_speed);
  }

  run(keyCode: number) {
    var o = this;
    if (keyCode == key.upArrow) { o.speedUp(); }
    else if (keyCode == key.downArrow) { o.slowDown(); }
  }

  private speedUp() {
    var o = this;
    o.wrap((params) => {
      params.p_speed = params.p_speed + 0.1;
      o.changeDisplayedSpeed(params.p_speed);
    });
  }

  private slowDown() {
    var o = this;
    o.wrap((params) => {
      params.p_speed = params.p_speed - 0.1;
      o.changeDisplayedSpeed(params.p_speed);
    });
  }

  private changeDisplayedSpeed(speed) {
    var oldText = $("#overlayDiv").text();
    $("#overlayDiv").text("" + Math.round(speed * 100));
  }

  private wrap(fn: (params: IPlayerParams) => void) {
    var o = this;
    var params = o.player.getParams();
    fn(params);
    o.player.setParams(params);
  }
}
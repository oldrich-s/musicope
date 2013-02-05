/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class ChangeSpeed implements IKeyboardActions {

  hotkeys = [key.upArrow, key.downArrow];

  constructor(private player: IPlayer, private parser: IParser) {
    var o = this;
    o.changeDisplayedSpeed(player.params.p_speed);
  }

  run(keyCode: number) {
    var o = this;
    if (keyCode == key.upArrow) { o.speedUp(); } else { o.slowDown(); }
  }

  private speedUp() {
    var o = this;
    o.player.params.p_speed = o.player.params.p_speed + 0.1;
    o.changeDisplayedSpeed(o.player.params.p_speed);
  }

  private slowDown() {
    var o = this;
    o.player.params.p_speed = o.player.params.p_speed - 0.1;
    o.changeDisplayedSpeed(o.player.params.p_speed);
  }

  private changeDisplayedSpeed(speed) {
    var oldText = $("#overlayDiv").text();
    $("#overlayDiv").text("" + Math.round(speed * 100));
  }
}
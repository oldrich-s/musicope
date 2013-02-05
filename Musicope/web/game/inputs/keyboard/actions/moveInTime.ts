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
    var newTime = o.player.params.p_elapsedTime - 2 * o.parser.timePerBeat;
    o.player.params.p_elapsedTime = Math.max(o.player.params.p_initTime, newTime);
  }

  private moveForward() {
    var o = this;
    var newTime = o.player.params.p_elapsedTime + 2 * o.parser.timePerBeat;
    o.player.params.p_elapsedTime = Math.min(o.parser.timePerSong + 10, newTime);
  }

  private goHome() {
    var o = this;
    o.player.params.p_elapsedTime = o.player.params.p_initTime;
  }
}
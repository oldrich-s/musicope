/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class MoveInTime implements IGame.IKeyboardActions {

  hotkeys = [key.leftArrow, key.rightArrow, key.home];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) { }

  keyPressed(keyCode: number) {
    var o = this;
    if (keyCode == key.leftArrow) { o.moveBack(); }
    else if (keyCode == key.rightArrow) { o.moveForward(); }
    else if (keyCode == key.home) { o.goHome(); }
  }

  private moveBack() {
    var o = this;
      var newTime = o.params.readOnly.p_elapsedTime - 2 * o.parser.timePerBeat;
      var truncTime = Math.max(o.params.readOnly.p_initTime, newTime);
      o.params.setParam("p_elapsedTime", truncTime);
  }

  private moveForward() {
    var o = this;
      var newTime = o.params.readOnly.p_elapsedTime + 2 * o.parser.timePerBeat;
      var truncTime = Math.min(o.parser.timePerSong + 10, newTime);
      o.params.setParam("p_elapsedTime", truncTime);
  }

  private goHome() {
    var o = this;
    o.params.setParam("p_elapsedTime", o.params.readOnly.p_initTime);
  }

}
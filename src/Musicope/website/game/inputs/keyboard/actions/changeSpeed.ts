/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import overlays = module("../overlays/_load");

export class ChangeSpeed implements IGame.IKeyboardActions {

  hotkeys = [key.upArrow, key.downArrow];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) {
    var o = this;
  }

  keyPressed(keyCode: number) {
    var o = this;
    if (keyCode == key.upArrow) { o.speedUp(); }
    else if (keyCode == key.downArrow) { o.slowDown(); }
  }

  private speedUp() {
    var o = this;
    o.params.setParam("p_speed", o.params.readOnly.p_speed + 0.1);
    overlays.basic.display("p_speed", o.params.readOnly.p_speed);
  }

  private slowDown() {
    var o = this;
    o.params.setParam("p_speed", o.params.readOnly.p_speed - 0.1);
    overlays.basic.display("p_speed", o.params.readOnly.p_speed);
  }



}
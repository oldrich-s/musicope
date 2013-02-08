/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class ChangeSpeed implements IGame.IKeyboardActions {

  hotkeys = [key.upArrow, key.downArrow];

  private container: IJQuery.JQuery;

  constructor(private params: IGame.IParams, private parser: IGame.IParser) {
    var o = this;
    o.container = $("<div />").appendTo('#overlayDiv');
    o.changeDisplayedSpeed(params.readOnly.p_speed);
  }

  keyPressed(keyCode: number) {
    var o = this;
    if (keyCode == key.upArrow) { o.speedUp(); }
    else if (keyCode == key.downArrow) { o.slowDown(); }
  }

  private changeDisplayedSpeed(speed) {
    var o = this;
    o.container.text("" + Math.round(speed * 100));
  }

  private speedUp() {
    var o = this;
    o.params.setParam("p_speed", o.params.readOnly.p_speed + 0.1);
    o.changeDisplayedSpeed(o.params.readOnly.p_speed);
  }

  private slowDown() {
    var o = this;
    o.params.setParam("p_speed", o.params.readOnly.p_speed - 0.1);
    o.changeDisplayedSpeed(o.params.readOnly.p_speed);
  }



}
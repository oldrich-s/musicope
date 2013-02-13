/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class slowDown implements IGame.IKeyboardAction {

  id = "slow down";
  description = "slow down the song by 10%";
  keySequence = [key.downArrow];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) { }

  triggerAction() {
    var o = this;
    o.params.setParam("p_speed", o.params.readOnly.p_speed - 0.1);
  }

}
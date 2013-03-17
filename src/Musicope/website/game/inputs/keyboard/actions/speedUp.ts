/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class speedUp implements IGame.IKeyboardAction {

  id = "speed up";
  description =  "speed up the song by 10%";
  key = key.upArrow;

  constructor(private p: IGame.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    o.p.params.setParam("p_speed", o.p.params.readOnly.p_speed + 0.1);
  }

  getCurrentState() {
    var o = this;
    return o.p.params.readOnly.p_speed * 100;
  }

}
/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class speedUp implements IGame.IKeyboardAction {

  id = "speed up";
  description =  "speed up the song by 10%";
  keySequence = [key.upArrow];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) { }

  triggerAction() {
    var o = this;
    o.params.setParam("p_speed", o.params.readOnly.p_speed + 0.1);
  }

  getCurrentState() {
    var o = this;
    return o.params.readOnly.p_speed;
  }

}
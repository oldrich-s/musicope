/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class moveBack implements IGame.IKeyboardAction {

  id = "move back";
  description = "move back by the amount of 2 beats";
  keySequence = [key.leftArrow];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) { }

  triggerAction() {
    var o = this;
    var newTime = o.params.readOnly.p_elapsedTime - 2 * o.parser.timePerBeat;
    var truncTime = Math.max(o.params.readOnly.p_initTime, newTime);
    o.params.setParam("p_elapsedTime", truncTime);
  }

  getCurrentState() {
    var o = this;
    return o.params.readOnly.p_elapsedTime;
  }

}
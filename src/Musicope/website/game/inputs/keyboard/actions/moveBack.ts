/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class moveBack implements IGame.IKeyboardAction {

  id = "move back";
  description = "move back by the amount of 2 beats";
  key = key.leftArrow;

  constructor(private p: IGame.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    var newTime = o.p.params.readOnly.p_elapsedTime - 2 * o.p.song.timePerBeat;
    var truncTime = Math.max(o.p.params.readOnly.p_initTime, newTime);
    o.p.params.setParam("p_elapsedTime", truncTime);
  }

  getCurrentState() {
    var o = this;
    return o.p.params.readOnly.p_elapsedTime / 1000;
  }

}
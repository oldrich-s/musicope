/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class pauseOn implements IGame.IKeyboardAction {

  id = "pause on";
  description = "pause and unpause the game";
  keySequence = [key.space];

  constructor(private p: IGame.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    o.p.params.setParam("p_isPaused", !o.p.params.readOnly.p_isPaused);
  }

  getCurrentState() {
    var o = this;
    return o.p.params.readOnly.p_isPaused;
  }

}
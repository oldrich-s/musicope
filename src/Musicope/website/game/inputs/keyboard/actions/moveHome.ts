/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class moveHome implements IGame.IKeyboardAction {

  id = "move home";
  description = "move to the initial state of the song";
  keySequence = [key.home];

  constructor(private p: IGame.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    o.p.params.setParam("p_elapsedTime", o.p.params.readOnly.p_initTime);
  }

  getCurrentState() {
    var o = this;
    return o.p.params.readOnly.p_elapsedTime / 1000;
  }

}
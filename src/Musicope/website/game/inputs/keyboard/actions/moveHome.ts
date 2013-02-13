/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class moveHome implements IGame.IKeyboardAction {

  id = "move home";
  description = "move to the initial state of the song";
  keySequence = [key.home];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) { }

  triggerAction() {
    var o = this;
    o.params.setParam("p_elapsedTime", o.params.readOnly.p_initTime);
  }

  getCurrentState() {
    var o = this;
    return o.params.readOnly.p_elapsedTime;
  }

}
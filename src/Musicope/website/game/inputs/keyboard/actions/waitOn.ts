/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import utility = module("./_utility");

export class waitOn implements IGame.IKeyboardAction {

  id = "wait on";
  description = "shall the song wait for the user?";
  keySequence = [key.w];

  private options = [[false, false], [true, true]];

  constructor(private p: IGame.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    o.p.params.setParam("p_waits", utility.toggle(o.p.params.readOnly.p_waits, o.options));
  }

  getCurrentState() {
    var o = this;
    return o.p.params.readOnly.p_waits;
  }

}
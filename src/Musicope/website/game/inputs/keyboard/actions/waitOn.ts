/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import utility = module("./_utility");

export class waitOn implements IGame.IKeyboardAction {

  id = "wait on";
  description = "Shall the song wait for the user?";
  keySequence = [key.w];

  private options = [[false, false], [true, true]];

  constructor(private params: IGame.IParams, private song: IGame.ISong) { }

  triggerAction() {
    var o = this;
    o.params.setParam("p_waits", utility.toggle(o.params.readOnly.p_waits, o.options));
  }

  getCurrentState() {
    var o = this;
    return o.params.readOnly.p_waits;
  }

}
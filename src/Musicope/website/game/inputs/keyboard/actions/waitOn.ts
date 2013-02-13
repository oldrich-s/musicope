/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import utility = module("./_utility");

export class waitOn implements IGame.IKeyboardAction {

  id = "wait on";
  description = "Shall the song wait for the user?";
  keySequence = [key.w];

  private options = [[false, false], [true, true]];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) { }

  triggerAction() {
    var o = this;
    o.params.setParam("p_waits", utility.toggle(o.params.readOnly.p_waits, o.options));
  }

}
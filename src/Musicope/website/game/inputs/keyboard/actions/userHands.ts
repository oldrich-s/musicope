/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import utility = module("./_utility");

export class userHands implements IGame.IKeyboardAction {

  id = "user hands";
  description = "toggle which hands the user plays.";
  keySequence = [key.h];

  private options = [[false, false], [false, true], [true, false], [true, true]];
  private names = ["none", "right", "left", "both"];

  constructor(private p: IGame.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    o.p.params.setParam("p_userHands", utility.toggle(o.p.params.readOnly.p_userHands, o.options));
  }

  getCurrentState() {
    var o = this;
    var i = o.options.indexOf(o.p.params.readOnly.p_userHands);
    return o.names[i];
  }

}
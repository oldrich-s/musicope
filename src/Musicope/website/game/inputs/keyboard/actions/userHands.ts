/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import utility = module("./_utility");

export class userHands implements IGame.IKeyboardAction {

  id = "user hands";
  description = "Toggle which hands the user plays.";
  keySequence = [key.h];

  private options = [[false, false], [false, true], [true, false], [true, true]];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) { }

  triggerAction() {
    var o = this;
    o.params.setParam("p_userHands", utility.toggle(o.params.readOnly.p_userHands, o.options));
  }

}
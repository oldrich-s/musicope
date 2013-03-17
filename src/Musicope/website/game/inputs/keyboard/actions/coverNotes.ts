/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import toolsM = module("./_tools");

export class coverNotes implements IGame.IKeyboardAction {

  id = "cover notes";
  description = "Cover notes";
  key = key.c;

  private states = [0.0, 0.2, 0.4, 0.6, 0.8];

  constructor(private p: IGame.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    var height: number = toolsM.toggle(o.p.params.readOnly.s_noteCoverRelHeight, o.states);
    o.p.params.setParam("s_noteCoverRelHeight", height);
  }

  getCurrentState() {
    var o = this;
    return o.p.params.readOnly.s_noteCoverRelHeight;
  }

}
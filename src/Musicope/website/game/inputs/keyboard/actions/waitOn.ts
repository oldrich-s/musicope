/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import toolsM = module("./_tools");

export class waitOn implements IGame.IKeyboardAction {

  id = "wait";
  description = "shall the song wait for the user?";
  key = key.w;

  private options = [[false, false], [true, true]];
  private names = ["off", "on"];

  constructor(private p: IGame.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    o.p.params.setParam("p_waits", toolsM.toggle(o.p.params.readOnly.p_waits, o.options));
  }

  getCurrentState() {
    var o = this;
    var i = o.options.indexOf(o.p.params.readOnly.p_waits);
    return o.names[i];
  }

}
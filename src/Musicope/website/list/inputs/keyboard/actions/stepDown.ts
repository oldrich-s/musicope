/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class stepDown implements IList.IKeyboardAction {

  id = "step down";
  description = "proceeds to the next song";
  keySequence = [key.downArrow];

  constructor(private p: IList.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    //o.p.params.setParam("p_waits", utility.toggle(o.p.params.readOnly.p_waits, o.options));
  }

  getCurrentState() {
    var o = this;
    return 0;
  }

}
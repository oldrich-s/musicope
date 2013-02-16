/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class stepUp implements IList.IKeyboardAction {

  id = "step up";
  description = "";
  keySequence = [key.upArrow];

  constructor(private p: IList.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    var index = o.p.inputParams.listIndex() - 1;
    var trimmedIndex = index < 0 ? 0 : index;
    o.p.inputParams.listIndex(trimmedIndex);
  }

  getCurrentState() {
    var o = this;
    return 0;
  }

}
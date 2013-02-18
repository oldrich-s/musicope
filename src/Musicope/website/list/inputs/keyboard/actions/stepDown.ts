/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import toolsM = module("./_tools");

export class stepDown implements IList.IKeyboardAction {

  id = "step down";
  description = "";
  keySequence = [key.downArrow];

  private contr: IList.IController;

  constructor(p: IList.IKeyboardParams) {
    var o = this;
    o.contr = p.inputParams.controller;
  }

  triggerAction() {
    var o = this;
    var index = o.contr.listIndex() + 1;
    var length = o.contr.displayedSongs().length;
    var trimmedIndex = index >= length ? length - 1 : index;
    o.contr.listIndex(trimmedIndex);
    toolsM.correctPosition();
  }

  getCurrentState() {
    var o = this;
    return 0;
  }

}
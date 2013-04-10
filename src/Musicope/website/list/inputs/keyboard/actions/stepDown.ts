/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class stepDown implements IList.IKeyboardAction {

  id = "step down";
  description = "";
  key = key.downArrow;

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
  }

  getCurrentState() {
    var o = this;
    return 0;
  }

}
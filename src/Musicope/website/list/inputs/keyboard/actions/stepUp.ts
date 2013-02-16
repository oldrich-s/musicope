/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class stepUp implements IList.IKeyboardAction {

  id = "step up";
  description = "";
  keySequence = [key.upArrow];

  private contr: IList.IController;

  constructor(p: IList.IKeyboardParams) {
    var o = this;
    o.contr = p.inputParams.controller;
  }

  triggerAction() {
    var o = this;
    var index = o.contr.listIndex() - 1;
    var trimmedIndex = index < 0 ? 0 : index;
    o.contr.listIndex(trimmedIndex);
    o.correctPosition();
  }

  getCurrentState() {
    var o = this;
    return 0;
  }

  private correctPosition() {
    var el = $(".elFocus");
    var rely: number = el.offset()["top"] + el.height() - $(window).scrollTop();
    if (rely < 0.2 * window.innerHeight) {
      $(window).scrollTop(el.offset()["top"] - 2 * el.height());
    }
  }

}
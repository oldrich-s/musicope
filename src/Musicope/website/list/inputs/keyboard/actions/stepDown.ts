/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

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
    var length = o.contr.filteredSongs().length;
    var trimmedIndex = index >= length ? length - 1 : index;
    o.contr.listIndex(trimmedIndex);
    o.correctPosition();
  }

  getCurrentState() {
    var o = this;
    return 0;
  }

  private correctPosition() {
    var el = $(".elFocus");
    var rely: number = el.offset()["top"] - $(window).scrollTop();
    if (rely > 0.8 * window.innerHeight) {
      var dy = window.innerHeight - 2 * el.height() - rely;
      $(window).scrollTop($(window).scrollTop() - dy);
    }
  }

}
/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class voteUp implements IList.IKeyboardAction {

  id = "vote up";
  description = "";
  key = key.upArrow;
  isCtrl = true;

  private contr: IList.IController;

  constructor(p: IList.IKeyboardParams) {
    var o = this;
    o.contr = p.inputParams.controller;
  }

  triggerAction() {
    var o = this;
    var song: IList.ISong = o.contr.displayedSongs()[o.contr.listIndex()];
    song.db["votes"](song.db["votes"]() + 1);
  }

  getCurrentState() {
    var o = this;
    return 0;
  }

}
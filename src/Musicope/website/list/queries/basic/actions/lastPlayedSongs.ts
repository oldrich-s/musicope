/// <reference path="../../../_references.ts" />

export class lastPlayedSongs implements IList.IQueryBasicAction {

  id = "last played songs";
  description = "";
  regexp = /^lps$/;
  priority = 10;

  private contr: IList.IController;

  constructor(p: IList.IQueryBasicActionParams) {
    var o = this;
    o.contr = p.inputParams.controller;
  }

  triggerAction(queryMatch: string[]) {
    var o = this;
  }

}
/// <reference path="../../../_references.ts" />

import key = module("../../../../../common/keyCodes");
import load = module("../_load");

export class displayHelp implements IGame.IKeyboardAction {

  id = "display help";
  description = "Displays help window";
  keySequence = [key.enter];

  window: IJQuery.JQuery;
  isDisplayed = false;

  constructor(private params: IGame.IParams, private song: IGame.ISong) {
    var o = this;
    $.get("inputs/keyboard/actions/displayHelp/overlay.html").done((result) => {
      $(result).appendTo("body");
      o.window = $("#displayHelpOverlay");
      o.window.text("jeden maly testik");
    });
    
  }

  triggerAction() {
    var o = this;
    o.isDisplayed = !o.isDisplayed;
    o.params.setParam("p_isPaused", o.isDisplayed);
    var text = o.isDisplayed ? "block" : "none";
    o.window.css("display", text);
  }

  getCurrentState() {
    var o = this;
    return o.isDisplayed;
  }

  private createTable() {
    
  }

}
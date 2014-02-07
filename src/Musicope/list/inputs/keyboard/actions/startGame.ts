module Musicope.List.Inputs.KeyboardFns.Actions.List {

  export class StartGame implements IKeyboardAction {

    id = "start game";
    description = "";
    key = KeyCodes.enter;

    private contr: Controllers.IController;

    constructor(p: IKeyboardParams) {
      var o = this;
      o.contr = p.inputParams.controller;
    }

    triggerAction() {
      var o = this;
      var song = o.contr.displayedSongs()[o.contr.listIndex()];
      o.contr.redirect(o.contr.listIndex, song);
    }

    getCurrentState() {
      var o = this;
      return 0;
    }

  }

}
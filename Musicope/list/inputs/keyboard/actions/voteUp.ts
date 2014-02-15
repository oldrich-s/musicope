module Musicope.List.Inputs.KeyboardFns.Actions.List {

  export class VoteUp implements IKeyboardAction {

    id = "vote up";
    description = "";
    key = "ctrl+up";

    private contr: Controller;

    constructor(p: IKeyboardParams) {
      var o = this;
      o.contr = p.inputParams.controller;
    }

    triggerAction() {
      var o = this;
      var song: ISong = o.contr.displayedSongs()[o.contr.listIndex()];
      song.db["votes"](song.db["votes"]() + 1);
    }

    getCurrentState() {
      var o = this;
      return 0;
    }

  }

}
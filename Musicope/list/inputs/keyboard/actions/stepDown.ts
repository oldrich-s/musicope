module Musicope.List.Inputs.KeyboardFns.Actions.List {

  export class StepDown implements IKeyboardAction {

    id = "step down";
    description = "";
    key = KeyCodes.downArrow;

    private contr: Controllers.IController;

    constructor(p: IKeyboardParams) {
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

}
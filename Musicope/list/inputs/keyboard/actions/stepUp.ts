module Musicope.List.Inputs.KeyboardFns.Actions.List {

  export class StepUp implements IKeyboardAction {

    id = "step up";
    description = "";
    key = "up";

    private contr: Controller;

    constructor(p: IKeyboardParams) {
      var o = this;
      o.contr = p.inputParams.controller;
    }

    triggerAction() {
      var o = this;
      var index = o.contr.listIndex() - 1;
      var trimmedIndex = index < 0 ? 0 : index;
      o.contr.listIndex(trimmedIndex);
    }

    getCurrentState() {
      var o = this;
      return 0;
    }

  }

}
module Musicope.Game.Inputs.KeyboardFns.Actions.List {

  export class MoveHome implements IKeyboardAction {

    id = "move home";
    description = "move to the initial state of the song";
    key = KeyCodes.home;

    constructor(private p: IKeyboardParams) { }

    triggerAction() {
      var o = this;
      o.p.params.setParam("p_elapsedTime", o.p.params.readOnly.p_initTime);
    }

    getCurrentState() {
      var o = this;
      return o.p.params.readOnly.p_elapsedTime / 1000;
    }

  }

}
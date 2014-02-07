module Musicope.Game.Inputs.KeyboardFns.Actions.List {

  export class PauseOn implements IKeyboardAction {

    id = "pause";
    description = "pause and unpause the game";
    key = KeyCodes.space;

    constructor(private p: IKeyboardParams) { }

    triggerAction() {
      var o = this;
      o.p.params.setParam("p_isPaused", !o.p.params.readOnly.p_isPaused);
    }

    getCurrentState() {
      var o = this;
      return o.p.params.readOnly.p_isPaused ? "on" : "off";
    }

  }

}
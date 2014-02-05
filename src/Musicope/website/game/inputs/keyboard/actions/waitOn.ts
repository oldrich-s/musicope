module Musicope.Game.Inputs.KeyboardFns.Actions {

  export class WaitOn implements IKeyboardAction {

    id = "wait";
    description = "shall the song wait for the user?";
    key = KeyCodes.w;

    private options = [[false, false], [true, true]];
    private names = ["off", "on"];

    constructor(private p: IKeyboardParams) { }

    triggerAction() {
      var o = this;
      o.p.params.setParam("p_waits", Tools.toggle(o.p.params.readOnly.p_waits, o.options));
    }

    getCurrentState() {
      var o = this;
      var i = o.options.indexOf(o.p.params.readOnly.p_waits);
      return o.names[i];
    }

  }

}
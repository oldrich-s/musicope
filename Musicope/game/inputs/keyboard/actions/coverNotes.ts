module Musicope.Game.Inputs.KeyboardFns.Actions.List {

  export class CoverNotes implements IKeyboardAction {

    id = "cover notes";
    description = "Cover notes";
    key = "c";

    private states = [0.0, 0.2, 0.4, 0.6, 0.8];

    constructor(private p: IKeyboardParams) { }

    triggerAction() {
      var o = this;
      var height: number = Tools.toggle(o.p.params.readOnly.s_noteCoverRelHeight, o.states);
      o.p.params.setParam("s_noteCoverRelHeight", height);
    }

    getCurrentState() {
      var o = this;
      return o.p.params.readOnly.s_noteCoverRelHeight;
    }

  }

}
module Musicope.Game.Inputs.KeyboardFns.Actions.List {

  export class MetronomeOn implements IKeyboardAction {

    id = "metronome";
    description = "toggle state of the metronome on/off";
    key = "m";

    constructor(private p: IKeyboardParams) { }

    triggerAction() {
      var o = this;
      o.p.params.setParam("m_isOn", !o.p.params.readOnly.m_isOn);
    }

    getCurrentState() {
      var o = this;
      return o.p.params.readOnly.m_isOn ? "on" : "off";
    }

  }

}
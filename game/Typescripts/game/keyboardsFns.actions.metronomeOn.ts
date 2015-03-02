module Musicope.Game.KeyboardFns.Actions.List {

    export class MetronomeOn implements IKeyboardAction {

        id = "metronome";
        description = "toggle state of the metronome on/off";
        key = "m";

        constructor(private p: IKeyboardParams) { }

        triggerAction() {
            var o = this;
            Params.setParam("m_isOn", !params.m_isOn);
        }

        getCurrentState() {
            var o = this;
            return params.m_isOn ? "on" : "off";
        }

    }

}
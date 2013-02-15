/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class metronomeOn implements IGame.IKeyboardAction {

  id = "metronome on";
  description = "toggle state of the metronome on/off";
  keySequence = [key.m];

  constructor(private p: IGame.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    o.p.params.setParam("m_isOn", !o.p.params.readOnly.m_isOn);
  }

  getCurrentState() {
    var o = this;
    return o.p.params.readOnly.m_isOn;
  }

}
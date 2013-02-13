/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class metronomeOn implements IGame.IKeyboardAction {

  id = "metronome on";
  description = "Toggle state of the metronome on/off.";
  keySequence = [key.m];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) { }

  triggerAction() {
    var o = this;
    o.params.setParam("m_isOn", !o.params.readOnly.m_isOn);
  }

  getCurrentState() {
    var o = this;
    return o.params.readOnly.m_isOn;
  }

}
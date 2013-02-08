/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import overlays = module("../overlays/_load");

export class Metronome implements IGame.IKeyboardActions {

  hotkeys = [key.m];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) {
  }

  keyPressed(keyCode: number) {
    var o = this;
    if (keyCode == key.m) {
      o.toggleMetronome();
    }
  }

  private toggleMetronome() {
    var o = this;
    o.params.setParam("m_isOn", !o.params.readOnly.m_isOn);
    overlays.basic.display("m_isOn", o.params.readOnly.m_isOn);
  }

}
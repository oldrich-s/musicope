/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class Metronome implements IGame.IKeyboardActions {

  hotkeys = [key.m];

  private m_velocity: number;

  constructor(private params: IGame.IParams, private parser: IGame.IParser) {
  }

  run(keyCode: number) {
    var o = this;
    if (keyCode == key.m) {
      o.toggleMetronome();
    }
  }

  private toggleMetronome() {
    var o = this;
    if (o.params.readOnly.m_velocity > 0) {
      o.m_velocity = o.params.readOnly.m_velocity;
      o.params.setParam("m_velocity", 0);
    } else {
      o.params.setParam("m_velocity", o.m_velocity);
    }
  }

}
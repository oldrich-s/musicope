/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class Metronome implements IKeyboardActions {

  hotkeys = [key.m];

  private m_velocity: number;

  constructor(private player: IPlayer, private parser: IParser) {
  }

  run(keyCode: number) {
    var o = this;
    if (keyCode == key.m) {
      o.toggleMetronome();
    }
  }

  private toggleMetronome() {
    var o = this;
    if (o.player.metronome.params.m_velocity > 0) {
      o.m_velocity = o.player.metronome.params.m_velocity;
      o.player.metronome.params.m_velocity = 0;
    } else {
      o.player.metronome.params.m_velocity = o.m_velocity;
    }
  }

}
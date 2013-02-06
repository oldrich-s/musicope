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
    o.wrap((params) => {
      if (params.m_velocity > 0) {
        o.m_velocity = params.m_velocity;
        params.m_velocity = 0;
      } else {
        params.m_velocity = o.m_velocity;
      }
    });
  }

  private wrap(fn: (params: IMetronomeParams) => void) {
    var o = this;
    var params = o.player.metronome.getParams();
    fn(params);
    o.player.metronome.setParams(params);
  }

}
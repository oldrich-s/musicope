/// <reference path="../../_references.ts" />

import key = module("../../../common/keyCodes");

export class Keyboard implements IGameInput {

  private oldText;

  constructor(private player: IPlayer, private parser: IParser) {
    var o = this;

    $(document).on("keydown.IGameViewInputsKeyboard", function (e) {
      switch (e.which) {
        case key.m:
          o.toggleMetronome();
          break;
        case key.space:
          player.params.p_isPaused = player.params.p_isPaused ? false : true;
          break;
        default:
        }
    });

  }

  private m_vel;
  private toggleMetronome() {
    var o = this;
    if (o.player.metronome.params.m_velocity > 0) {
      o.m_vel = o.player.metronome.params.m_velocity;
      o.player.metronome.params.m_velocity = 0;
    } else {
      o.player.metronome.params.m_velocity = o.m_vel;
    }
  }
}
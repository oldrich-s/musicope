/// <reference path="../../_references.ts" />

import key = module("../../../common/keyCodes");

export class Keyboard implements IGameInput {

  private oldText;
  private player: IPlayer;
  private parser: IParser;

  constructor() { }

  _init(player: IPlayer, parser: IParser) {
    var o = this;
    o.player = player; o.parser = parser;

    function changeSpeed(speed) {
      o.oldText = $("#overlayDiv").text();
      $("#overlayDiv").text("" + Math.round(speed * 100));
    }

    $(document).on("keydown.IGameViewInputsKeyboard", function (e) {
      switch (e.which) {
        case key.m:
          o.toggleMetronome();
          break;
        case key.downArrow: // down
          player.params.p_speed = player.params.p_speed - 0.1;
          changeSpeed(player.params.p_speed);
          break;
        case key.upArrow: // up
          player.params.p_speed = player.params.p_speed + 0.1;
          changeSpeed(player.params.p_speed);
          break;
        case key.leftArrow: // left
          player.params.p_elapsedTime = Math.max(player.params.p_initTime, player.params.p_elapsedTime - 2 * parser.timePerBeat);
          break;
        case key.rightArrow: // right
          player.params.p_elapsedTime = Math.min(parser.timePerSong + 10, player.params.p_elapsedTime + 2 * parser.timePerBeat);
          break;
        case key.pageUp:
        case key.home:
          player.params.p_elapsedTime = player.params.p_initTime;
          break;
        case key.space:
          player.params.p_isPaused = player.params.p_isPaused ? false : true;
          break;
        default:
        }
    });

    changeSpeed(player.params.p_speed);

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
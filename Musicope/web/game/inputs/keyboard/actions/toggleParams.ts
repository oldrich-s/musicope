/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class ToggleParams implements IKeyboardActions {

  hotkeys = [key.w, key.h];
  private currentHand;

  constructor(private player: IPlayer, private parser: IParser) { }

  run(keyCode: number) {
    var o = this;
    if (keyCode == key.w) {
      o.toggleWait();
    } else if (keyCode == key.h) {
      o.toggleHands();
    }
  }

  private toggleWait() {
    var o = this;
  }

  private toggleHands() {
    var o = this;
    o.wrap((params) => {
      var options = [[false, false], [false, true], [true, false], [true, true]];
      for (var i = 0; i < options.length; i++) {
        var areEqual = params.p_userHands.every((param, j) => {
          return param == options[i][j];
        });
        if (areEqual) {
          params.p_userHands = options[(i + 1) % options.length];
          break;
        }
      }
    });
  }

  private wrap(fn: (params: IPlayerParams) => void) {
    var o = this;
    var params = o.player.getParams();
    fn(params);
    o.player.setParams(params);
  }

}
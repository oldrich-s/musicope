/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class Unsorted implements IKeyboardActions {

  hotkeys = [key.space];

  constructor(private player: IPlayer, private parser: IParser) { }

  run(keyCode: number) {
    var o = this;
    if (keyCode == key.space) {
      o.togglePause();
    }
  }

  private togglePause() {
    var o = this;
    o.wrap((params) => {
      params.p_isPaused = !params.p_isPaused;
    });
  }

  private wrap(fn: (params: IPlayerParams) => void) {
    var o = this;
    var params = o.player.getParams();
    fn(params);
    o.player.setParams(params);
  }

}
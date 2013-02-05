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
    o.player.params.p_isPaused = !o.player.params.p_isPaused;
  }

}
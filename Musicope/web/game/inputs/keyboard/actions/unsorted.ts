/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class Unsorted implements IGame.IKeyboardActions {

  hotkeys = [key.space];

  constructor(private params: IGame.IParams, private parser: IGame.IParser) { }

  run(keyCode: number) {
    var o = this;
    if (keyCode == key.space) {
      o.togglePause();
    }
  }

  private togglePause() {
    var o = this;
    o.params.setParam("p_isPaused", !o.params.readOnly.p_isPaused);
  }

}
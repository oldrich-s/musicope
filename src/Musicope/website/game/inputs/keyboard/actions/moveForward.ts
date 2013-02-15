/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class moveForward implements IGame.IKeyboardAction {

  id = "move forward";
  description = "move forward by the amount of 2 beats";
  keySequence = [key.rightArrow];

  constructor(private p: IGame.IKeyboardParams) { }

  triggerAction() {
    var o = this;
    var newTime = o.p.params.readOnly.p_elapsedTime + 2 * o.p.song.timePerBeat;
    var truncTime = Math.min(o.p.song.timePerSong + 10, newTime);
    o.p.params.setParam("p_elapsedTime", truncTime);
  }

  getCurrentState() {
    var o = this;
    return o.p.params.readOnly.p_elapsedTime / 1000;
  }

}
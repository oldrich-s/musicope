/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class moveForward implements IGame.IKeyboardAction {

  id = "move forward";
  description = "move forward by the amount of 2 beats";
  keySequence = [key.rightArrow];

  constructor(private params: IGame.IParams, private parser: IGame.IPostParser) { }

  triggerAction() {
    var o = this;
    var newTime = o.params.readOnly.p_elapsedTime + 2 * o.parser.timePerBeat;
    var truncTime = Math.min(o.parser.timePerSong + 10, newTime);
    o.params.setParam("p_elapsedTime", truncTime);
  }

  getCurrentState() {
    var o = this;
    return o.params.readOnly.p_elapsedTime / 1000;
  }

}
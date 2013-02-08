/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");
import overlays = module("../overlays/_load");

export class Hands implements IGame.IKeyboardActions {

  hotkeys = [key.w, key.h];
  private currentHand;
  
  constructor(private params: IGame.IParams, private parser: IGame.IParser) {
    var o = this;
  }

  keyPressed(keyCode: number) {
    var o = this;
    if (keyCode == key.w) {
      o.toggleWait();
    } else if (keyCode == key.h) {
      o.toggleHands();
    }
  }

  private toggleWait() {
    var o = this;
    var options = [[false, false], [true, true]];
    o.params.setParam("p_waits", o.toggle(o.params.readOnly.p_waits, options));
    overlays.basic.display("p_waits", JSON.stringify(o.params.readOnly.p_waits));
  }

  private toggleHands() {
    var o = this;
    var options = [[false, false], [false, true], [true, false], [true, true]];
    o.params.setParam("p_userHands", o.toggle(o.params.readOnly.p_userHands, options));
    overlays.basic.display("User plays", JSON.stringify(o.params.readOnly.p_userHands));
  }

  private toggle(currentOption: any, options: any[]) {
    var o = this;
    for (var i = 0; i < options.length; i++) {
      if (o.params.areEqual(currentOption, options[i])) {
        return options[(i + 1) % options.length];
      }
    }
  }



}
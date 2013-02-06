/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class ToggleParams implements IKeyboardActions {

  hotkeys = [key.w, key.h];
  private currentHand;
  private DisplayDescription: IJQuery.JQuery;
  private DisplayValue: IJQuery.JQuery;
  private oldTimeOut: number;

  constructor(private player: IPlayer, private parser: IParser) {
    var o = this;
    var container = $("<div />").appendTo('#overlayDiv');
    o.DisplayDescription = $("<span />").appendTo(container);
    o.DisplayValue = $("<span style='color:red;font-size:large;' />").appendTo(container);
  }

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
    o.wrap((params) => {
      var options = [[false, false], [true, true]];
      params.p_waits = o.toggle(params.p_waits, options);
      o.display("p_waits", JSON.stringify(params.p_waits));
    });
  }

  private toggleHands() {
    var o = this;
    o.wrap((params) => {
      var options = [[false, false], [false, true], [true, false], [true, true]];
      params.p_userHands = o.toggle(params.p_userHands, options);
      o.display("User plays", JSON.stringify(params.p_userHands));
    });
  }

  private toggle(currentOption: any, options: any[]) {
    for (var i = 0; i < options.length; i++) {
      var areEqual = JSON.stringify(currentOption) == JSON.stringify(options[i]);
      if (areEqual) {
        return options[(i + 1) % options.length];
      }
    }
  }

  private display(description: string, value: string) {
    var o = this;
    o.DisplayDescription.text(description + ": ");
    o.DisplayValue.text(value);
    clearTimeout(o.oldTimeOut);
    o.oldTimeOut = setTimeout(() => {
      o.DisplayDescription.text("");
      o.DisplayValue.text("");
    }, 5000);
  }

  private wrap(fn: (params: IPlayerParams) => void) {
    var o = this;
    var params = o.player.getParams();
    fn(params);
    o.player.setParams(params);
  }

}
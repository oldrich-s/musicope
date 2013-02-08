/// <reference path="../../../_references.ts" />

import key = module("../../../../common/keyCodes");

export class ToggleParams implements IGame.IKeyboardActions {

  hotkeys = [key.w, key.h];
  private currentHand;
  private DisplayDescription: IJQuery.JQuery;
  private DisplayValue: IJQuery.JQuery;
  private oldTimeOut: number;

  constructor(private params: IGame.IParams, private parser: IGame.IParser) {
    var o = this;
    var container = $("<div />").appendTo('#overlayDiv');
    o.DisplayDescription = $("<span />").appendTo(container);
    o.DisplayValue = $("<span style='color:red;font-size:large;' />").appendTo(container);
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
    o.display("p_waits", JSON.stringify(o.params.readOnly.p_waits));
  }

  private toggleHands() {
    var o = this;
    var options = [[false, false], [false, true], [true, false], [true, true]];
    o.params.setParam("p_userHands", o.toggle(o.params.readOnly.p_userHands, options));
    o.display("User plays", JSON.stringify(o.params.readOnly.p_userHands));
  }

  private toggle(currentOption: any, options: any[]) {
    var o = this;
    for (var i = 0; i < options.length; i++) {
      if (o.params.areEqual(currentOption, options[i])) {
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

}
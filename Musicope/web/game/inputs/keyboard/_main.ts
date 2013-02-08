/// <reference path="../../_references.ts" />

import actions = module("./actions/_load");

export class Keyboard implements IGame.IInput {

  private actionObjects: IGame.IKeyboardActions[] = [];

  constructor(private player: IGame.IPlayer, private parser: IGame.IParser) {
    var o = this;
    o.initActions();
    o.signupActions();
  }

  private initActions() {
    var o = this;
    for (var prop in actions) {
      var action = new (<IGame.IKeyboardActionsNew> actions[prop])(o.player, o.parser);
      o.actionObjects.push(action);
    }
  }

  private signupActions() {
    var o = this;
    $(document).keydown((e) => {
      o.actionObjects.forEach((action) => {
        var isValid = action.hotkeys.some((key) => {
          return key == e.which;
        });
        if (isValid) {
          action.keyPressed(e.which);
        }
      });
    });
  }

}
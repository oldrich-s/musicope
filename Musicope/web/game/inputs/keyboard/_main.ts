/// <reference path="../../_references.ts" />

import actions = module("./actions/_load");

export class Keyboard implements IGameInput {

  private actionObjects: IKeyboardActions[] = [];

  constructor(private player: IPlayer, private parser: IParser) {
    var o = this;
    o.initActions();
    o.signupActions();
  }

  private initActions() {
    var o = this;
    for (var prop in actions) {
      var action = new (<IKeyboardActionsNew> actions[prop])(o.player, o.parser);
      o.actionObjects.push(action);
    }
  }

  private signupActions() {
    var o = this;
    $(document).keydown((e) => {
      o.actionObjects.forEach((action) => {
        action.run(e.which);
      });
    });
  }

}
/// <reference path="../../_references.ts" />

import actions = module("./actions/_load");
import overlays = module("./overlays/_load");

export class Keyboard implements IGame.IInput {

  private actions: IGame.IKeyboardAction[] = [];
  private keys: number[] = [];

  constructor(private params: IGame.IParams, private song: IGame.ISong) {
    var o = this;
    o.initActions();
    o.signupActions();
  }

  private initActions() {
    var o = this;
    for (var prop in actions) {
      var action = new (<IGame.IKeyboardActionsNew> actions[prop])(o.params, o.song);
      o.actions.push(action);
    }
  }

  private signupActions() {
    var o = this;
    $(document).keydown((e) => {
      o.keys.push(e.which);
      o.analyzePressedKeys();
    });
  }

  private analyzePressedKeys() {
    var o = this;
    for (var i = 0; i < o.actions.length; i++) {
      var match = o.doActionKeysMatch(o.actions[i]);
      if (match) {
        o.keys = [];
        o.actions[i].triggerAction();
        overlays.basic.display(o.actions[i].id, o.actions[i].getCurrentState());
        return;
      }
    }
  }

  private doActionKeysMatch(action: IGame.IKeyboardAction) {
    var o = this;
    var matchFound = action.keySequence.every((key, i) => {
      var oldId = o.keys.length - action.keySequence.length + i;
      return o.keys[oldId] && o.keys[oldId] === key;
    });
    return matchFound;
  }

}
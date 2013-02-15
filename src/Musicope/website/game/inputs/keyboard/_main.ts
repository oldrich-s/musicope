/// <reference path="../../_references.ts" />

import actionsM = module("./actions/_load");
import overlaysM = module("./overlays/_load");

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
    var deff = $.Deferred();
    var keyboardParams: IGame.IKeyboardParams = {
      params: o.params,
      song: o.song,
      actions: deff.promise()
    }
    for (var prop in actionsM) {
      var action = new (<IGame.IKeyboardActionsNew> actionsM[prop])(keyboardParams);
      o.actions.push(action);
    }
    deff.resolve(o.actions);
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
        overlaysM.basic.display(o.actions[i].id, o.actions[i].getCurrentState());
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
/// <reference path="../../_references.ts" />

import actionsM = module("./actions/_load");

export class Keyboard implements IList.IInput {

  private actions: IList.IKeyboardAction[] = [];
  private keys: number[] = [];

  constructor() {
    var o = this;
    o.initActions();
    o.signupActions();
  }

  private initActions() {
    var o = this;
    var deff = $.Deferred();
    var keyboardParams: IList.IKeyboardParams = {
    }
    for (var prop in actionsM) {
      var action = new (<IList.IKeyboardActionsNew> actionsM[prop])(keyboardParams);
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
        return;
      }
    }
  }

  private doActionKeysMatch(action: IList.IKeyboardAction) {
    var o = this;
    var matchFound = action.keySequence.every((key, i) => {
      var oldId = o.keys.length - action.keySequence.length + i;
      return o.keys[oldId] && o.keys[oldId] === key;
    });
    return matchFound;
  }

}
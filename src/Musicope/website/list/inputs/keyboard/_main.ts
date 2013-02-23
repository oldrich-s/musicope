/// <reference path="../../_references.ts" />

import actionsM = module("./actions/_load");

export class Keyboard implements IList.IInput {

  private actions: IList.IKeyboardAction[] = [];
  private keys: number[] = [];

  constructor(private params: IList.IInputParams) {
    var o = this;
    o.initActions();
    o.signupActions();
  }

  private initActions() {
    var o = this;
    var keyboardParams: IList.IKeyboardParams = {
      inputParams: o.params
    }
    for (var prop in actionsM) {
      var action = new (<IList.IKeyboardActionsNew> actionsM[prop])(keyboardParams);
      o.actions.push(action);
    }
  }

  private signupActions() {
    var o = this;
    $(document).keydown((e) => {
      o.keys.push(e.which);
      o.analyzePressedKeys(e);
    });
  }

  private analyzePressedKeys(e: IJQuery.JQueryEventObject) {
    var o = this;
    for (var i = 0; i < o.actions.length; i++) {
      var match = o.doActionKeysMatch(o.actions[i]);
      if (match) {
        o.keys = [];
        o.actions[i].triggerAction();
        e.preventDefault();
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
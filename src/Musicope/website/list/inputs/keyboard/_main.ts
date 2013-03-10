/// <reference path="../../_references.ts" />

import actionsM = module("./actions/_load");

export class Keyboard implements IList.IInput {

  private actions: IList.IKeyboardAction[] = [];

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
      o.analyzePressedKeys(e);
    });
  }

  private analyzePressedKeys(e: IJQuery.JQueryEventObject) {
    var o = this;
    for (var i = 0; i < o.actions.length; i++) {
      if (o.doActionKeysMatch(o.actions[i], e)) {
        o.actions[i].triggerAction();
        e.preventDefault();
        return;
      }
    }
  }

  private doActionKeysMatch(action: IList.IKeyboardAction, e: IJQuery.JQueryEventObject) {
    var sameKeys = action.key === e.which;
    var sameAlt = (!action.isAlt && !e["altKey"]) || (action.isAlt && e["altKey"]);
    var sameCtrl = (!action.isCtrl && !e["ctrlKey"]) || (action.isCtrl && e["ctrlKey"]);
    var sameShift = (!action.isShift && !e["shiftKey"]) || (action.isShift && e["shiftKey"]);
    return sameKeys && sameAlt && sameCtrl && sameShift;
  }

}
module Musicope.List.Inputs.List {

  export class Keyboard implements IInput {

    private actions: KeyboardFns.Actions.IKeyboardAction[] = [];

    constructor(private params: IInputParams) {
      var o = this;
      o.initActions();
      o.signupActions();
    }

    private initActions() {
      var o = this;
      var keyboardParams: KeyboardFns.Actions.IKeyboardParams = {
        inputParams: o.params
      }
    for (var prop in KeyboardFns.Actions.List) {
      var action = new (<KeyboardFns.Actions.IKeyboardActionsNew> KeyboardFns.Actions.List[prop])(keyboardParams);
        o.actions.push(action);
      }
    }

    private signupActions() {
      var o = this;
      $(document).keydown((e) => {
        o.analyzePressedKeys(e);
      });
    }

    private analyzePressedKeys(e: JQueryKeyEventObject) {
      var o = this;
      for (var i = 0; i < o.actions.length; i++) {
        if (o.doActionKeysMatch(o.actions[i], e)) {
          o.actions[i].triggerAction();
          e.preventDefault();
          return;
        }
      }
    }

    private doActionKeysMatch(action: KeyboardFns.Actions.IKeyboardAction, e: JQueryKeyEventObject) {
      var sameKeys = action.key === e.which;
      var sameAlt = (!action.isAlt && !e["altKey"]) || (action.isAlt && e["altKey"]);
      var sameCtrl = (!action.isCtrl && !e["ctrlKey"]) || (action.isCtrl && e["ctrlKey"]);
      var sameShift = (!action.isShift && !e["shiftKey"]) || (action.isShift && e["shiftKey"]);
      return sameKeys && sameAlt && sameCtrl && sameShift;
    }

  }

}
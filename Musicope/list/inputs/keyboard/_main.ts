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
      o.actions.forEach((action) => {
        Mousetrap.bind(action.key, (e) => {
          action.triggerAction();
          e.preventDefault();
        });
      });
    }

  }

}
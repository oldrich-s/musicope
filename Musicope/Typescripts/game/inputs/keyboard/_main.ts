module Musicope.Game.Inputs {

  export class Keyboard implements IInput {

    private actions: KeyboardFns.Actions.IKeyboardAction[] = [];

    constructor(private params: Params.IParams, private song: Songs.ISong) {
      var o = this;
      o.initActions();
      o.checkActionsDuplicates();
      o.signupActions();
    }

    private initActions() {
      var o = this;
      var deff = $.Deferred();
      var keyboardParams: KeyboardFns.Actions.IKeyboardParams = {
        params: o.params,
        song: o.song,
        actions: deff.promise()
      }
    for (var prop in KeyboardFns.Actions.List) {
        var action = new (<KeyboardFns.Actions.IKeyboardActionsNew> KeyboardFns.Actions.List[prop])(keyboardParams);
        o.actions.push(action);
      }
      deff.resolve(o.actions);
    }

    private checkActionsDuplicates() {
      var o = this;
      var keys = {};
      o.actions.forEach((action) => {
        if (keys[action.key]) {
          var text = "duplicate keys: '" + keys[action.key] + "' vs '" + action.id + "'";
          throw text;
        }
        keys[action.key] = action.id;
      });
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
        var match = o.doActionKeysMatch(o.actions[i], e);
        if (match) {
          o.actions[i].triggerAction();
          KeyboardFns.Overlay.display(o.actions[i].id, o.actions[i].getCurrentState());
          return;
        }
      }
    }

    private doActionKeysMatch(action: KeyboardFns.Actions.IKeyboardAction, e: JQueryKeyEventObject) {
      var sameKeys = action.key === e.which;
      return sameKeys;
    }

  }

}
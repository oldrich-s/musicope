module Musicope.Game.Inputs {

  export class Keyboard implements IInput {

    private actions: IGame.IKeyboardAction[] = [];

    constructor(private params: IGame.IParams, private song: IGame.ISong) {
      var o = this;
      o.initActions();
      o.checkActionsDuplicates();
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

    private analyzePressedKeys(e: IJQuery.JQueryEventObject) {
      var o = this;
      for (var i = 0; i < o.actions.length; i++) {
        var match = o.doActionKeysMatch(o.actions[i], e);
        if (match) {
          o.actions[i].triggerAction();
          overlaysM.basic.display(o.actions[i].id, o.actions[i].getCurrentState());
          return;
        }
      }
    }

    private doActionKeysMatch(action: IGame.IKeyboardAction, e: IJQuery.JQueryEventObject) {
      var sameKeys = action.key === e.which;
      return sameKeys;
    }

  }

}
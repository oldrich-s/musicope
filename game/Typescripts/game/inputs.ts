module Musicope.Game.Inputs {

    export class Keyboard implements IInput {

        private actions: KeyboardFns.Actions.IKeyboardAction[] = [];

        constructor(private song: Song) {
            var o = this;
            o.initActions();
            o.checkActionsDuplicates();
            o.signupActions();
        }

        private initActions() {
            var o = this;
            var deff = $.Deferred();
            var keyboardParams: KeyboardFns.Actions.IKeyboardParams = {
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
            o.actions.forEach((action) => {
                Mousetrap.bind(action.key,() => {
                    action.triggerAction();
                    KeyboardFns.Overlay.display(action.id, action.getCurrentState());
                });
            });
        }

    }

} 
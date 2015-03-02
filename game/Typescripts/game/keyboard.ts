module Musicope.Game {

    export class Keyboard implements IDisposable {

        private actions: KeyboardFns.Actions.IKeyboardAction[] = [];

        constructor(private song: Song) {
            var o = this;
            o.initActions();
            o.checkActionsDuplicates();
            o.subscribeActions();
        }

        dispose = () => {
            var o = this;
            o.unsubscribeActions();
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

        private subscribeActions() {
            var o = this;
            o.actions.forEach((action) => {
                Mousetrap.bind(action.key,() => {
                    action.triggerAction();
                    KeyboardFns.Overlay.display(action.id, action.getCurrentState());
                });
            });
        }

        private unsubscribeActions() {
            var o = this;
            o.actions.forEach((action) => {
                Mousetrap.unbind(action.key);
            });
        }

    }

} 
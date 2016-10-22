module Musicope.Game {

    export interface IKeyboardAction {
        title: string;
        description: string;
        triggerAction(song: Song): void;
        getCurrentState(): any;
    }

    export var keyboardActions: { [index: string]: IKeyboardAction } = {};

    export class Keyboard {

        constructor(private song: Song) {
            var o = this;
            o.subscribeActions();
            $('.canvasInfo').hide();
        }

        private subscribeActions() {
            var o = this;
            for (var key in keyboardActions) {
                Mousetrap.bind(key, function (action) {
                    action.triggerAction(o.song);
                    KeyboardOverlay.display(action.title, action.getCurrentState());
                }.bind(this, keyboardActions[key]));
            }
        }

    }

} 
module Musicope.Game.Inputs.KeyboardFns.Actions.List {

    export class Exit implements IKeyboardAction {

        id = "exit";
        description = "Exits the game view.";
        key = "esc";

        constructor(private p: IKeyboardParams) { }

        triggerAction() {
            Params.reset();
            $('#gameView').hide();
            $('#listView').show();
            $('#query').focus();
            Musicope.List.Keyboard.bindKeyboard();
        }

        getCurrentState() {
        }

    }

} 
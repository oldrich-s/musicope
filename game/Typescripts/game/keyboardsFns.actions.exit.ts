module Musicope.Game.KeyboardFns.Actions.List {

    export class Exit implements IKeyboardAction {

        id = "exit";
        description = "Exits the game view.";
        key = "esc";

        constructor(private p: IKeyboardParams) { }

        triggerAction() {
            game.dispose();
            Params.reset();
            Musicope.List.Keyboard.bindKeyboard();
            $('#gameView').hide();
            $('#listView').show();
            $('#query').focus();
            var top = $('.elFocus').offset().top - 0.5 * $(window).height();
            $(window).scrollTop(top);
        }

        getCurrentState() {
        }

    }

} 
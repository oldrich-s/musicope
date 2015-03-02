module Musicope.Game.KeyboardFns.Actions.List {

    export class WaitOn implements IKeyboardAction {

        id = "wait";
        description = "shall the song wait for the user?";
        key = "w";

        private options = [[false, false], [true, true]];
        private names = ["off", "on"];

        constructor(private p: IKeyboardParams) { }

        triggerAction() {
            var o = this;
            Params.setParam("p_waits", Tools.toggle(params.p_waits, o.options));
        }

        getCurrentState() {
            var o = this;
            var i = o.options.indexOf(params.p_waits);
            return o.names[i];
        }

    }

} 
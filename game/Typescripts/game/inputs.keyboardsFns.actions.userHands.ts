module Musicope.Game.Inputs.KeyboardFns.Actions.List {

    export class UserHands implements IKeyboardAction {

        id = "user hands";
        description = "toggle which hands the user plays.";
        key = "h";

        private options = [[false, false], [false, true], [true, false], [true, true]];
        private names = ["none", "right", "left", "both"];

        constructor(private p: IKeyboardParams) { }

        triggerAction() {
            var o = this;
            Params.setParam("p_userHands", Tools.toggle(params.p_userHands, o.options));
        }

        getCurrentState() {
            var o = this;
            var i = o.options.indexOf(params.p_userHands);
            return o.names[i];
        }

    }

}
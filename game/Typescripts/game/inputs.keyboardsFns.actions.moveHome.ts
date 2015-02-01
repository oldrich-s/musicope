module Musicope.Game.Inputs.KeyboardFns.Actions.List {

    export class MoveHome implements IKeyboardAction {

        id = "move home";
        description = "move to the initial state of the song";
        key = "home";

        constructor(private p: IKeyboardParams) { }

        triggerAction() {
            var o = this;
            Params.setParam("p_elapsedTime", params.p_initTime);
        }

        getCurrentState() {
            var o = this;
            return params.p_elapsedTime / 1000;
        }

    }

}
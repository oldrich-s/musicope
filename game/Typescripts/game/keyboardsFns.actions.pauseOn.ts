module Musicope.Game.KeyboardFns.Actions.List {

    export class PauseOn implements IKeyboardAction {

        id = "pause";
        description = "pause and unpause the game";
        key = "space";

        constructor(private p: IKeyboardParams) { }

        triggerAction() {
            var o = this;
            Params.setParam("p_isPaused", !params.p_isPaused);
        }

        getCurrentState() {
            var o = this;
            return params.p_isPaused ? "on" : "off";
        }

    }

}
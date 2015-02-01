module Musicope.Game.Inputs.KeyboardFns.Actions.List {

    export class MoveForward implements IKeyboardAction {

        id = "move forward";
        description = "move forward by the amount of 2 beats";
        key = "right";

        constructor(private p: IKeyboardParams) { }

        triggerAction() {
            var o = this;
            var newTime = params.p_elapsedTime + 2 * o.p.song.timePerBeat;
            var truncTime = Math.min(o.p.song.timePerSong + 10, newTime);
            Params.setParam("p_elapsedTime", truncTime);
        }

        getCurrentState() {
            var o = this;
            return params.p_elapsedTime / 1000;
        }

    }

}
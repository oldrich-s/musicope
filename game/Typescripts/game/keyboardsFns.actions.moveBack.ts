module Musicope.Game.KeyboardFns.Actions.List {

    export class MoveBack implements IKeyboardAction {

        id = "move back";
        description = "move back by the amount of 2 beats";
        key = "left";

        constructor(private p: IKeyboardParams) { }

        triggerAction() {
            var o = this;
            var newTime = params.p_elapsedTime - 2 * o.p.song.midi.timePerBeat;
            var truncTime = Math.max(params.p_initTime, newTime);
            Params.setParam("p_elapsedTime", truncTime);
        }

        getCurrentState() {
            var o = this;
            return params.p_elapsedTime / 1000;
        }

    }

} 
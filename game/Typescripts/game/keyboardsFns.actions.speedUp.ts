module Musicope.Game.KeyboardFns.Actions.List {

    export class SpeedUp implements IKeyboardAction {

        id = "speed up";
        description = "speed up the song by 10%";
        key = "up";

        constructor(private p: IKeyboardParams) { }

        triggerAction() {
            var o = this;
            Params.setParam("p_speed", params.p_speed + 0.1);
        }

        getCurrentState() {
            var o = this;
            return params.p_speed * 100;
        }

    }

}
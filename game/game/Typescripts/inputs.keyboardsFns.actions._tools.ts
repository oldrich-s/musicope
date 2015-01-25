module Musicope.Game.Inputs.KeyboardFns.Actions.Tools {

    export function areEqual(param1: any, param2: any) {
        if (typeof param1 === "object" && typeof param2 === "object" &&
            "every" in param1 && "every" in param2) {
            var areEqual = (<any[]> param1).every((param1i, i) => {
                return param1i == param2[i];
            });
            return areEqual;
        } else {
            return param1 == param2;
        }
    }

    export function toggle(currentOption: any, options: any[]) {
        for (var i = 0; i < options.length; i++) {
            if (areEqual(currentOption, options[i])) {
                return options[(i + 1) % options.length];
            }
        }
    }

} 
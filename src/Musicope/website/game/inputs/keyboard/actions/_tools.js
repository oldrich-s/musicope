var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (Tools) {
                        function areEqual(param1, param2) {
                            if (typeof param1 === "object" && typeof param2 === "object" && "every" in param1 && "every" in param2) {
                                var areEqual = param1.every(function (param1i, i) {
                                    return param1i == param2[i];
                                });
                                return areEqual;
                            } else {
                                return param1 == param2;
                            }
                        }
                        Tools.areEqual = areEqual;

                        function toggle(currentOption, options) {
                            for (var i = 0; i < options.length; i++) {
                                if (areEqual(currentOption, options[i])) {
                                    return options[(i + 1) % options.length];
                                }
                            }
                        }
                        Tools.toggle = toggle;
                    })(Actions.Tools || (Actions.Tools = {}));
                    var Tools = Actions.Tools;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=_tools.js.map

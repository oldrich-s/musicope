module Musicope.Game {

    $(document).ready(() => {

        var options = [[false, false], [true, true]];
        var names = ["off", "on"];

        keyboardActions["w"] = {
            title: "Wait",
            description: "The song playback stops until the correct note is hit.",
            triggerAction: (song: Song) => {
                Params.setParam("p_waits", KeyboardTools.toggle(config.p_waits, options));
            },
            getCurrentState: () => {
                var i = options.indexOf(config.p_waits);
                return names[i];
            }
        };

    });

}
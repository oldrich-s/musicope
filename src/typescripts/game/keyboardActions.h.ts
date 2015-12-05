module Musicope.Game {

    $(document).ready(() => {

        var options = [[false, false], [false, true], [true, false], [true, true]];
        var names = ["none", "right", "left", "both"];

        keyboardActions["h"] = {
            title: "Hands",
            description: "Defines which hands are played by the user [no hands / right hand / left hand / both hands].",
            triggerAction: (song: Song) => {
                Params.setParam("p_userHands", KeyboardTools.toggle(config.p_userHands, options));
            },
            getCurrentState: () => {
                var i = options.indexOf(config.p_userHands);
                return names[i];
            }
        };

    });

}
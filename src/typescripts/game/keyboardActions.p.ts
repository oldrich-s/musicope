module Musicope.Game {

    $(document).ready(() => {
        
        var options = [0, 1, 0.7, 1.3];

        keyboardActions["p"] = {
            title: "Play all hands",
            description: "Always play all notes.",
            triggerAction: () => {
                Params.setParam("p_playAllHands", KeyboardTools.toggle(config.p_playAllHands, options));
            },
            getCurrentState: () => {
                var i = options.indexOf(config.p_playAllHands);
                return options[i];
            }
        };

    });

}
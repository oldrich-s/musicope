module Musicope.Game {

    $(document).ready(() => {

        var states = [0.0, 0.2, 0.4, 0.6, 0.8];

        keyboardActions["c"] = {
            title: "Cover notes",
            description: "Cover a part of the note bars to increase the difficulty level.",
            triggerAction: () => {
                var height: number = KeyboardTools.toggle(config.s_noteCoverRelHeight, states);
                Params.setParam("s_noteCoverRelHeight", height);
            },
            getCurrentState: () => {
                return config.s_noteCoverRelHeight;
            }
        };

    });

}
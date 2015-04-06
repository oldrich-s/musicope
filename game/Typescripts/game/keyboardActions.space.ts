module Musicope.Game {

    $(document).ready(() => {

        keyboardActions["space"] = {
            title: "Pause",
            description: "Pause / unpause the song playback.",
            triggerAction: (song: Song) => {
                Params.setParam("p_isPaused", !config.p_isPaused);
            },
            getCurrentState: () => {
                return config.p_isPaused ? "on" : "off";
            }
        };

    });

}
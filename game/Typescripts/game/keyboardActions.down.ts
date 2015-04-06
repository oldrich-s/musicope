module Musicope.Game {

    $(document).ready(() => {

        keyboardActions["down"] = {
            title: "Slow down",
            description: "Slow down the playback by 10 percent points.",
            triggerAction: (song: Song) => {
                Params.setParam("p_speed", config.p_speed - 0.1);
            },
            getCurrentState: () => {
                return config.p_speed * 100;
            }
        };

    });

}
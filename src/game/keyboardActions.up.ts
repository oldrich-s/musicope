module Musicope.Game {

    $(document).ready(() => {

        keyboardActions["up"] = {
            title: "Speed up",
            description: "Speed up the playback by 10 percent points.",
            triggerAction: (song: Song) => {
                Params.setParam("p_speed", config.p_speed + 0.1);
            },
            getCurrentState: () => {
                return config.p_speed * 100;
            }
        };

    });

}
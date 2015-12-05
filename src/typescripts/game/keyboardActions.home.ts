module Musicope.Game {

    $(document).ready(() => {

        keyboardActions["home"] = {
            title: "Rewind start",
            description: "Rewind the song back to the initial position.",
            triggerAction: (song: Song) => {
                Params.setParam("p_elapsedTime", config.p_initTime);
            },
            getCurrentState: () => {
                return config.p_elapsedTime / 1000;
            }
        };

    });

}
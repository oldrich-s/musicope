module Musicope.Game {

    $(document).ready(() => {

        keyboardActions["left"] = {
            title: "Fast backward",
            description: "Fast backward the song by the amount of 2 beats.",
            triggerAction: (song: Song) => {
                var newTime = config.p_elapsedTime - 2 * song.midi.timePerBeat;
                var truncTime = Math.max(config.p_initTime, newTime);
                Params.setParam("p_elapsedTime", truncTime);
            },
            getCurrentState: () => {
                return config.p_elapsedTime / 1000;
            }
        };

    });

}
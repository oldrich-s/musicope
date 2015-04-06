module Musicope.Game {

    $(document).ready(() => {

        keyboardActions["right"] = {
            title: "Fast forward",
            description: "Fast forward the song by the amount of 2 beats.",
            triggerAction: (song: Song) => {
                var newTime = config.p_elapsedTime + 2 * song.midi.timePerBeat;
                var truncTime = Math.min(song.timePerSong + 10, newTime);
                Params.setParam("p_elapsedTime", truncTime);
            },
            getCurrentState: () => {
                return config.p_elapsedTime / 1000;
            }
        };

    });

}
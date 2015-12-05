module Musicope.Game {

    $(document).ready(() => {

        keyboardActions["end"] = {
            title: "Goto end",
            description: "Rewind the song to the end.",
            triggerAction: (song: Song) => {
                var end = 0;
                song.midi.tracks.forEach((t) => {
                    t.forEach((n) => {
                        if (n.time > end) {
                            end = n.time;
                        }
                    });
                });
                Params.setParam("p_elapsedTime",  end);
            },
            getCurrentState: () => {
                return config.p_elapsedTime / 1000;
            }
        };

    });

}
module Musicope.Game {

    $(document).ready(() => {

        keyboardActions["left"] = {
            title: "Fast backward",
            description: "Fast backward the song by the amount of 2 beats.",
            triggerAction: (song: Song) => {
                var keys = Object.keys(song.midi.signatures).sort((a, b) => Number(b) - Number(a));
                var fkeys = keys.filter((s) => { return Number(s) < config.p_elapsedTime - 10; });
                var key = Number(fkeys.length == 0 ? keys[keys.length - 1] : fkeys[0]);
                var n = (config.p_elapsedTime - key) / song.midi.signatures[key].msecsPerBar;
                var newTime = key + Math.floor(n - 0.5) * song.midi.signatures[key].msecsPerBar;
                var truncTime = Math.max(config.p_initTime, newTime);
                Params.setParam("p_elapsedTime", truncTime);
            },
            getCurrentState: () => {
                return config.p_elapsedTime / 1000;
            }
        };

    });

}
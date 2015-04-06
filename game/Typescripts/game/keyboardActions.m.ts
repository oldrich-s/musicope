module Musicope.Game {

    $(document).ready(() => {

        keyboardActions["m"] = {
            title: "Metronome",
            description: "Toggle state of the metronome on/off",
            triggerAction: () => {
                Params.setParam("m_isOn", !config.m_isOn);
            },
            getCurrentState: () => {
                return config.m_isOn ? "on" : "off";
            }
        };

    });

}
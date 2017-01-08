import { IConfig } from "./i-config";

export var defaultConfig: IConfig = {

    // controllers
    c_songUrl: undefined,
    p_elapsedTime: undefined,
    p_initTime: undefined,

    // players
    p_loopStart: undefined,
    p_loopEnd: undefined,
    p_deviceIn: "0",
    p_deviceOut: "0",
    p_isPaused: false,
    p_minNote: 36,
    p_maxNote: 96,
    p_playOutOfReachNotes: true,
    p_waitForOutOfReachNotes: true,
    p_wait_ms: 200,
    p_speed: 1,
    p_sustain: true,
    p_userHands: [false, false],
    p_volumes: [0.75, 1],
    p_waits: [true, true],
    p_maxVelocity: [90, 90],
    p_playAllHands: 0,
    p_adaptableSpeed: true,

    // metronomes
    m_channel: 153,
    m_id1: 60,
    m_id2: 56,
    m_isOn: true,
    m_ticksPerBeat: 1,
    m_velocity: 12,

    // parsers
    f_normalize: 60,
    f_trackIds: [1, 0],

    // scenes
    s_showPiano: true,
    s_showSustainBg: false,
    s_views: ["full", "full"],
    s_quartersPerHeight: 10,
    s_showBlackRails: true,
    s_noteCoverRelHeight: 0.0,
    s_colorBlackRails2: "#371313",
    s_colorBlackRails3: "#282200",
    s_colWhites: ["#ff5252", "#ffd800"],
    s_colBlacks: ["#b73f3f", "#a78d00"],
    s_colTime: "#0094ff",
    s_colPianoWhite: "#2c79b2",
    s_colPianoBlack: "#3faeff",
    s_colSustain: "#00ff90",
    s_colSustainBg: "#002f1a",
    s_colPaused: "#090714",
    s_colUnPaused: "#0d0c0c",
    s_colUnPlayedNotes: "#808080",
    s_colOutOfReachNotes: "#ff5252",
    s_colUnPlayedNotesInReach: "#00ff90"
};

export function set(config) {
    defaultConfig = config;
}
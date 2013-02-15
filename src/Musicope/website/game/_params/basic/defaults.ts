/// <reference path="../../_references.ts" />

export var params: IGame.IParamsData = {

  // controllers
  c_songUrl: undefined,
  c_idevice: "Jazz",
  c_iscene: "Basic",
  c_iplayer: "Basic",
  c_iparser: "Basic",
  c_callbackUrl: undefined,

  // players
  p_deviceIn: "0",
  p_deviceOut: "1",
  p_elapsedTime: undefined,
  p_initTime: undefined,
  p_isPaused: true,  
  p_minNote: 36,
  p_maxNote: 96,
  p_playOutOfReachNotes: false,
  p_radiuses: [200, 200],
  p_speed: 1,
  p_sustain: true,
  p_userHands: [false, false],
  p_volumes: [1, 1],
  p_waits: [true, true],

  // metronomes
  m_channel: 153,
  m_id1: 60,
  m_id2: 56,
  m_isOn: true,
  m_ticksPerBeat: 1,
  m_velocity: 15,

  // parsers
  f_normalize: 60,
  f_trackIds: [1, 0],

  // scenes
  s_views: ["full", "full"],
  s_quartersPerHeight: 10,
  s_colWhites: ["#ff5252", "#ffd800"],
  s_colBlacks: ["#b73f3f", "#a78d00"],
  s_colTime: "#0094ff",
  s_colPianoWhite: "#2c79b2",
  s_colPianoBlack: "#3faeff",
  s_colSustain: "#00ff90",
  s_colPaused: "#090714",
  s_colUnPaused: "#0d0c0c",
  s_colUnPlayedNotes: "#808080",
  s_colOutOfReachNotes: "#ff5252",
  s_colUnPlayedNotesInReach: "#00ff90"
  
};
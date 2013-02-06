/// <reference path="_references.ts" />

export var iPlayerParams: IPlayerParams = {
  p_callbackUrl: undefined,
  p_deviceIn: "0",
  p_deviceOut: "0",
  p_elapsedTime: undefined,
  p_initTime: undefined,
  p_isPaused: false,
  p_minNote: 21,
  p_maxNote: 108,
  p_radiuses: [200, 200],
  p_speed: 1,
  p_sustain: true,
  p_userHands: [false, false],
  p_volumes: [1, 1],
  p_waits: [false, false],
};

export var iMetronomeParams: IMetronomeParams = {
  m_ticksPerBeat: 1,
  m_channel: 153,
  m_id1: 60,
  m_id2: 56,
  m_velocity: 15
};

export var iParserParams: IParserParams = {
  f_trackIds: [1, 0],
  f_normalize: 50
};

export var iSceneParams: ISceneParams = {
  s_views: ["full", "full"],
  s_quartersPerHeight: 10,
  s_colWhites: ["#ff5252", "#ffd800"],
  s_colBlacks: ["#b73f3f", "#a78d00"],
  s_colTime: "#0094ff",
  s_colPianoWhite: "#2c79b2",
  s_colPianoBlack: "#3faeff",
  s_colSustain: "#00ff90",
  s_colPaused: "#090714",
  s_colUnPaused: "#0d0c0c"
};

export var iCtrlParams: IGameParams = {
  g_songUrl: undefined,
  g_idevice: "Jazz",
  g_iscene: "Basic",
  g_iplayer: "Basic",
  g_iparser: "Midi"
};
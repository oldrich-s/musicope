/// <reference path="_references.ts" />

export var iPlayerParams: IPlayerParams = {
  p_deviceIn: "0",
  p_deviceOut: "0",
  p_elapsedTime: undefined,
  p_initTime: undefined,
  p_isPaused: false,
  p_radiuses: [200, 200],
  p_speed: 1,
  p_sustain: true,
  p_volumes: [1, 1],
  p_waits: [false, false],
};

export var iMetronomeParams: IMetronomeParams = {
  m_ticksPerBeat: 1,
  m_channel: 153,
  m_id1: 60,
  m_id2: 56,
  m_velocity: 20
};

export var iParserParams: IParserParams = {
  f_trackIds: [1, 0],
  f_normalize: 70
};

export var iSceneParams: ISceneParams = {
  v_views: ["full", "full"],
  v_quartersPerHeight: 5,
  v_colWhites: ["#ff5252", "#ffd800"],
  v_colBlacks: ["#b73f3f", "#a78d00"],
  v_colTime: "#0094ff",
  v_colPianoWhite: "#2c79b2",
  v_colPianoBlack: "#3faeff",
  v_colSustain: "#00ff90",
  v_colPaused: "#090714",
  v_colUnPaused: "#0d0c0c"
};

export var iCtrlParams: ICtrlParams = {
  c_songUrl: undefined,
  c_idevice: "Jazz",
  c_iscene: "Basic",
  c_iplayer: "Basic",
  c_iparser: "Midi"
};
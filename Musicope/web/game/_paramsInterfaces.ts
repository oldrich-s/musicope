/**
p_volumeL, p_volumeR: Relative velocity, e.g. 1 = the same as parser, 1.5 = 50% louder than parser
p_speed: Relative speed of the song, e.g. 1 = 100%
*/

interface IPlayerParams {
  p_callbackUrl: string;
  p_deviceIn: string;
  p_deviceOut: string;
  p_elapsedTime: number;
  p_initTime: number;
  p_isPaused: bool;
  p_radiuses: number[];
  p_speed: number;
  p_sustain: bool;
  p_userHands: bool[];
  p_volumes: number[];
  p_waits: bool[];
}

/**
m_velocity <0, 127>. Velocity (volume) of the metronome
*/
interface IMetronomeParams {
  m_velocity: number;
  m_id1: number;
  m_id2: number;
  m_channel: number;
  m_ticksPerBeat: number;
}

interface ISceneParams {
  s_views: string[];
  s_quartersPerHeight: number;
  s_colWhites: string[];
  s_colBlacks: string[];
  s_colTime: string;
  s_colPianoWhite: string;
  s_colPianoBlack: string;
  s_colSustain: string;
  s_colPaused: string;
  s_colUnPaused: string;
}

/**
  f_normalize <0, 127>. The mean velocity of the song = f_normalize
*/
interface IParserParams {
  f_normalize: number;
  f_trackIds: number[];
}

interface IGameParams {
  g_songUrl: string;
  g_idevice: string;
  g_iscene: string;
  g_iplayer: string;
  g_iparser: string;
}

interface IParams extends IPlayerParams, IMetronomeParams, ISceneParams, IGameParams, IParserParams {}

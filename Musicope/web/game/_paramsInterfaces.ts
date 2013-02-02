/**
p_volumeL, p_volumeR: Relative velocity, e.g. 1 = the same as parser, 1.5 = 50% louder than parser
p_speed: Relative speed of the song, e.g. 1 = 100%
*/

interface IPlayerParams {
  p_deviceIn: string;
  p_deviceOut: string;
  p_elapsedTime: number;
  p_initTime: number;
  p_isPaused: bool;
  p_radiuses: number[];
  p_speed: number;
  p_sustain: bool;
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
  v_views: string[];
  v_colWhites: string[];
  v_colBlacks: string[];
  v_colTime: string;
  v_colPianoWhite: string;
  v_colPianoBlack: string;
  v_colSustain: string;
  v_colPaused: string;
  v_colUnPaused: string;
}

/**
  f_normalize <0, 127>. The mean velocity of the song = f_normalize
*/
interface IParserParams {
  f_normalize: number;
  f_trackIds: number[];
}

interface ICtrlParams {
  c_songUrl: string;
  c_idevice: string;
  c_iscene: string;
  c_iplayer: string;
  c_iparser: string;
}

interface IParams extends IPlayerParams, IMetronomeParams, ISceneParams, ICtrlParams, IParserParams {}

/// <reference path="../_references.ts" />
// time units = miliseconds

interface INotePlayer {
  on: bool;
  time: number;
  id: number;
  velocity: number;
}

interface INoteScene {
  timeOn: number;
  timeOff: number;
  id: number;
  velocityOn: number;
  velocityOff: number;
}

interface IParser {
  params: IParserParams;
  timePerBeat: number;
  timePerBar: number;
  timePerSong: number;
  noteValuePerBeat: number; // denominator in time signature: 2, 4, 8, 16 ...
  tracksPlayer: INotePlayer[][];
  tracksViewer: INoteScene[][];
  _init(midi: Uint8Array, params: IParserParams): void;
}
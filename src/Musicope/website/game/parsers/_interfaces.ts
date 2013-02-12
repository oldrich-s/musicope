/// <reference path="../_references.ts" />
// time units = miliseconds
module IGame {

  export interface INotePlayer {
    on: bool;
    time: number;
    id: number;
    velocity: number;
  }

  export interface INoteScene {
    timeOn: number;
    timeOff: number;
    id: number;
    velocityOn: number;
    velocityOff: number;
  }

  export interface IParser {
    notesOutOfReach: bool;
    timePerBeat: number;
    timePerBar: number;
    timePerSong: number;
    noteValuePerBeat: number; // denominator in time signature: 2, 4, 8, 16 ...
    playerTracks: INotePlayer[][];
    sceneTracks: INoteScene[][];
  }

  export interface IParserNew {
    new (midi: Uint8Array, params: IParams): IParser;
  }
}
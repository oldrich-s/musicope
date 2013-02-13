/// <reference path="../_references.ts" />
// time units = miliseconds
module IGame {

  export interface INoteScene {
    timeOn: number;
    timeOff: number;
    id: number;
    velocityOn: number;
    velocityOff: number;
  }

  export interface IPostParser {
    notesOutOfReach: bool;
    timePerBeat: number;
    timePerBar: number;
    timePerSong: number;
    noteValuePerBeat: number; // denominator in time signature: 2, 4, 8, 16 ...
    playerTracks: INote[][];
    sceneTracks: INoteScene[][];
  }

  export interface IPostParserNew {
    new (midi: Uint8Array, params: IParams): IPostParser;
  }
}
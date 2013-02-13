/// <reference path="../_references.ts" />
// time units = miliseconds
module IGame {

  export interface INote {
    on: bool;
    time: number;
    id: number;
    velocity: number;
  }

  export interface IParser {
    timePerBeat: number;
    timePerBar: number;
    noteValuePerBeat: number; // denominator in time signature: 2, 4, 8, 16 ...
    tracks: INote[][];
  }

  export interface IParserNew {
    new (midi: Uint8Array): IParser;
  }
}
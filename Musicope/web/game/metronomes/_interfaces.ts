/// <reference path="../_references.ts" />
module IGame {
  export interface IMetronome {
    play(time: number);
    reset();
  }

  export interface IMetronomeNew {
    new (timePerBeat: number, beatsPerBar: number, device: IDevice, params: IParams): IMetronome;
  }
}
/// <reference path="../_references.ts" />

module IGame {

  export interface IPlayer {
    step(): void;
    isEnd(): bool;
  }

  export interface IPlayerNew {
    new (device: IDevice, song: ISong, metronome: IMetronome, scene: IScene, params: IParams): IPlayer;
  }

}
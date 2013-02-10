/// <reference path="../_references.ts" />

module IGame {

  export interface IPlayer {
    step(): bool;
  }

  export interface IPlayerNew {
    new (device: IDevice, parser: IParser, metronome: IMetronome, scene: IScene, params: IParams): IPlayer;
  }

}
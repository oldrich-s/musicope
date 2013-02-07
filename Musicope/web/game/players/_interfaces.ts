/// <reference path="../_references.ts" />

module IGame {

  export interface IPlayer {
  }

  export interface IPlayerNew {
    new (device: IDevice, parser: IParser, metronome: IMetronome, scene: IScene, params: IParams): IPlayer;
  }

}
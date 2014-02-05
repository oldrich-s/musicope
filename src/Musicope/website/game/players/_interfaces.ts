module Musicope.Game.Players {

  export interface IPlayer {
    step(): boolean; // isEnd
  }

  export interface IPlayerNew {
    new (device: IDevice, song: ISong, metronome: IMetronome, scene: IScene, params: IParams): IPlayer;
  }

}
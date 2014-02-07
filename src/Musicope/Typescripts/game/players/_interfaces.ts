module Musicope.Game.Players {

  export interface IPlayer {
    step(): boolean; // isEnd
  }

  export interface IPlayerNew {
    new (device: Devices.IDevice, song: Songs.ISong, metronome: Metronomes.IMetronome, scene: Scenes.IScene, params: Params.IParams): IPlayer;
  }

}
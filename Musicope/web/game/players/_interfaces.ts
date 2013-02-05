/// <reference path="../_references.ts" />

interface IPlayer {
  metronome: IMetronome;
  params: IPlayerParams;
}

interface IPlayerNew {
  new(device: IDevice, viewer: IScene, parser: IParser, params: IPlayerParams): IPlayer;
}
/// <reference path="../_references.ts" />

interface IPlayer {
  metronome: IMetronome;
  getParams(): IPlayerParams;
  setParams(params: IPlayerParams): void;
}

interface IPlayerNew {
  new(device: IDevice, viewer: IScene, parser: IParser, params: IPlayerParams): IPlayer;
}
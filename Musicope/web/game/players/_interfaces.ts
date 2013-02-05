/// <reference path="../_references.ts" />

interface IPlayer {
  metronome: IMetronome;
  getParam(name: string): any;
  setParam(name: string, value: any): void;
}

interface IPlayerNew {
  new(device: IDevice, viewer: IScene, parser: IParser, params: IPlayerParams): IPlayer;
}
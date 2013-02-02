/// <reference path="../_references.ts" />

interface IPlayer {
  metronome: IMetronome;
  params: IPlayerParams;
  _init(device: IDevice, viewer: IScene, parser: IParser, params: IPlayerParams): void;
}
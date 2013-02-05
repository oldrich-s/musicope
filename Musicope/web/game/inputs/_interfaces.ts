/// <reference path="../_references.ts" />

interface IGameInput {}

interface IGameInputNew {
  new (player: IPlayer, parser: IParser): IGameInput;
}
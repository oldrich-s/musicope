/// <reference path="../_references.ts" />

module IGame {

  export interface IInput {}

  export interface IInputNew {
    new (player: IPlayer, parser: IParser): IInput;
  }

}
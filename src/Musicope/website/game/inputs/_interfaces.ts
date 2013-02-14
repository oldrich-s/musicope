/// <reference path="../_references.ts" />

module IGame {

  export interface IInput {}

  export interface IInputNew {
    new (params: IParams, song: ISong): IInput;
  }

}
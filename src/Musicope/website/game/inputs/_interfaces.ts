module Musicope.Game {

  export interface IInput {}

  export interface IInputNew {
    new (params: Params.IParams, song: ISong): IInput;
  }

}
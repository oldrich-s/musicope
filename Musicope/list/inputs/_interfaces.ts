module Musicope.List.Inputs {

  export interface IInputParams {
    controller: Controller;
  }

  export interface IInput {}

  export interface IInputNew {
    new (params: IInputParams): IInput;
  }

}

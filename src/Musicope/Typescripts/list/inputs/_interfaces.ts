module Musicope.List.Inputs {

  export interface IInputParams {
    controller: Controllers.IController;
  }

  export interface IInput {}

  export interface IInputNew {
    new (params: IInputParams): IInput;
  }

}

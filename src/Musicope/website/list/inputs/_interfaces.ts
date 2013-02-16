/// <reference path="../_references.ts" />

module IList {

  export interface IInputParams {
    controller: IList.IController;
  }

  export interface IInput {}

  export interface IInputNew {
    new (params: IInputParams): IInput;
  }

}
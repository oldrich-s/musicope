/// <reference path="../_references.ts" />

module IList {

  export interface IInputParams {
    listIndex: KnockoutObservableNumber;
  }

  export interface IInput {}

  export interface IInputNew {
    new (params: IInputParams): IInput;
  }

}
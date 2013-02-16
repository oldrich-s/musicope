/// <reference path="../../../_references.ts" />

module IList {

  export interface IKeyboardAction {
    id: string;
    description: string;
    keySequence: number[];
    triggerAction(): void;
    getCurrentState(): any;
  }

  export interface IKeyboardParams {
    inputParams: IInputParams;
  }

  export interface IKeyboardActionsNew {
    new (params: IKeyboardParams): IKeyboardAction;
  }

}
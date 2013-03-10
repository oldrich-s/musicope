/// <reference path="../../../_references.ts" />

module IList {

  export interface IKeyboardAction {
    id: string;
    description: string;
    key: number;
    triggerAction(): void;
    getCurrentState(): any;
    isShift?: bool;
    isCtrl?: bool;
    isAlt?: bool;
  }

  export interface IKeyboardParams {
    inputParams: IInputParams;
  }

  export interface IKeyboardActionsNew {
    new (params: IKeyboardParams): IKeyboardAction;
  }

}
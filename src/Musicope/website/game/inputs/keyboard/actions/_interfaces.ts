/// <reference path="../../../_references.ts" />

module IGame {

  export interface IKeyboardAction {
    id: string;
    description: string;
    keySequence: number[];
    triggerAction(): void;
    getCurrentState(): any;
  }

  export interface IKeyboardParams {
    params: IParams;
    song: ISong;
    /// IGame.IKeyboardAction[];
    actions: IJQuery.JQueryPromise;
  }

  export interface IKeyboardActionsNew {
    new (params: IKeyboardParams): IKeyboardAction;
  }

}
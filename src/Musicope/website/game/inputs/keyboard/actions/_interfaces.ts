/// <reference path="../../../_references.ts" />

module IGame {

  export interface IKeyboardAction {
    id: string;
    description: string;
    keySequence: number[];
    triggerAction(): void;
    getCurrentState(): any;
  }

  export interface IKeyboardActionsNew {
    new (params: IParams, song: ISong): IKeyboardAction;
  }

}
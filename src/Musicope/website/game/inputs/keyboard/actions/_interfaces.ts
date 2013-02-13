module IGame {

  export interface IKeyboardAction {
    id: string;
    description: string;
    keySequence: number[];
    triggerAction(): void;
  }

  export interface IKeyboardActionsNew {
    new (params: IParams, parser: IParser): IKeyboardAction;
  }

}
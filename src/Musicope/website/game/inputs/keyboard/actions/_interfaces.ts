module Musicope.Game.Inputs.KeyboardFns.Actions {

  export interface IKeyboardAction {
    id: string;
    description: string;
    key: number;
    triggerAction(): void;
    getCurrentState(): any;
  }

  export interface IKeyboardParams {
    params: Params.IParams;
    song: ISong;
    actions: JQueryPromise<IGame.IKeyboardAction[]>;
  }

  export interface IKeyboardActionsNew {
    new (params: IKeyboardParams): IKeyboardAction;
  }

}

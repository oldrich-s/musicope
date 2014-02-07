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
    song: Songs.ISong;
    actions: JQueryPromise<IKeyboardAction[]>;
  }

  export interface IKeyboardActionsNew {
    new (params: IKeyboardParams): IKeyboardAction;
  }

}

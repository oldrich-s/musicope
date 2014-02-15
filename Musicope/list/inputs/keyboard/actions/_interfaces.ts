module Musicope.List.Inputs.KeyboardFns.Actions {

  export interface IKeyboardAction {
    id: string;
    description: string;
    key: string;
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
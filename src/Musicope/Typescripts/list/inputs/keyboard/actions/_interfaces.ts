module Musicope.List.Inputs.Keyboard.Actions {

  export interface IKeyboardAction {
    id: string;
    description: string;
    key: number;
    triggerAction(): void;
    getCurrentState(): any;
    isShift?: boolean;
    isCtrl?: boolean;
    isAlt?: boolean;
  }

  export interface IKeyboardParams {
    inputParams: IInputParams;
  }

  export interface IKeyboardActionsNew {
    new (params: IKeyboardParams): IKeyboardAction;
  }

}
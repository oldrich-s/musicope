module IGame {

  export interface IKeyboardActions {
    hotkeys: number[];
    keyPressed(keyCode: number): void;
  }

  export interface IKeyboardActionsNew {
    new (params: IParams, parser: IParser): IKeyboardActions;
  }

}
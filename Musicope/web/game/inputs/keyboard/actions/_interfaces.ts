module IGame {

  export interface IKeyboardActions {
    hotkeys: number[];
    run(keyCode: number): void;
  }

  export interface IKeyboardActionsNew {
    new (player: IPlayer, parser: IParser): IKeyboardActions;
  }

}
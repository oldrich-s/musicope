interface IKeyboardActions {
  hotkeys: number[];
  run(keyCode: number): void;
}

declare interface IKeyboardActionsNew {
  new (player: IPlayer, parser: IParser): IKeyboardActions;
}
interface IKeyboardActions {
  hotkeys: number[];
  run(keyCode: number): void;
}

interface IKeyboardActionsNew {
  new (player: IPlayer, parser: IParser): IKeyboardActions;
}
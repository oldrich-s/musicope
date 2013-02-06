/// <reference path="../_references.ts" />

interface IScene {
  getParams(): ISceneParams;
  setParams(params: ISceneParams): void;
  redraw(time: number, isPaused: bool): void;
  setPressedNote(noteId: number): void;
  unsetPressedNote(noteId: number): void;
  unsetAllPressedNotes(): void;
}

interface ISceneNew {
  new(parser: IParser, params: ISceneParams): IScene;
}
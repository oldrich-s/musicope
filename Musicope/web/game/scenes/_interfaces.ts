/// <reference path="../_references.ts" />

interface IScene {
  params: ISceneParams;
  redraw(time: number, isPaused: bool): void;
  setPressedNote(noteId: number): void;
  unsetPressedNote(noteId: number): void;
  unsetAllPressedNotes(): void;
}

interface ISceneNew {
  new(parser: IParser, params: ISceneParams): IScene;
}
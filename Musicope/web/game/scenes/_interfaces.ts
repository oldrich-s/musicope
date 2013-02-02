/// <reference path="../_references.ts" />

interface IScene {
  params: ISceneParams;
  _init(parser: IParser, params: ISceneParams): void;
  redraw(time: number, isPaused: bool): void;
  setPressedNote(noteId: number): void;
  unsetPressedNote(noteId: number): void;
  unsetAllPressedNotes(): void;
}
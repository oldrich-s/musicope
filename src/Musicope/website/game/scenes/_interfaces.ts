/// <reference path="../_references.ts" />

module IGame {

  export interface IScene {
    redraw(time: number, isPaused: bool): void;
    setPressedNote(noteId: number): void;
    unsetPressedNote(noteId: number): void;
    unsetAllPressedNotes(): void;
  }

  export interface ISceneNew {
    new (parser: IParser, params: IParams): IScene;
  }

}
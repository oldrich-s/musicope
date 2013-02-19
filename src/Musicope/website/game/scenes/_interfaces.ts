/// <reference path="../_references.ts" />

module IGame {

  export interface IScene {
    redraw(time: number, isPaused: bool): void;
    setActiveId(id: number): void;
    unsetActiveId(id: number): void;
    unsetAllActiveIds(): void;
  }

  export interface ISceneNew {
    new (song: ISong, params: IParams): IScene;
  }

}
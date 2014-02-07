module Musicope.Game.Scenes {

  export interface IScene {
    redraw(time: number, isPaused: boolean): void;
    setActiveId(id: number): void;
    unsetActiveId(id: number): void;
    unsetAllActiveIds(): void;
  }

  export interface ISceneNew {
    new (song: Songs.ISong, params: Params.IParams): IScene;
  }

}
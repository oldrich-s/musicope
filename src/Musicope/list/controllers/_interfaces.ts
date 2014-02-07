module Musicope.List.Controllers {

  export interface ISong {
    path: string;
    extension: string;
    name: string;
    url: string;
    db: {};
  }

  export interface IController {
    listIndex: KnockoutObservable<number>;
    displayedSongs: KnockoutObservable<any[]>;
    searchQuery: KnockoutObservable<string>;
    gameParams: KnockoutObservable<string>;
    songs: ISong[];
    updateFilteredSongs(songs: ISong[]): void;
    correctPosition(dom): void;
    redirect(indexFn: () => number, song: ISong): void;
  }

  export interface IControllerNew {
    new (): IController;
  }
}
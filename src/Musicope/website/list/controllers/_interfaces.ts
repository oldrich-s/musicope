/// <reference path="../_references.ts" />
module IList {

  export interface ISong {
    path: string;
    extension: string;
    name: string;
    url: string;
    db: {};
  }

  export interface IController {
    listIndex: KnockoutObservableNumber;
    displayedSongs: KnockoutObservableArray;
    searchQuery: KnockoutObservableString;
    gameParams: KnockoutObservableString;
    songs: IList.ISong[];
    updateFilteredSongs(songs: IList.ISong[]): void;
    correctPosition(dom): void;
    redirect(indexFn: () => number, song: ISong): void;
  }

  export interface IControllerNew {
    new (): IController;
  }
}
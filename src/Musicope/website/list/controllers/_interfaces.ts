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
    redirect(indexFn: () => number, song: ISong): void;
  }

  export interface IControllerNew {
    new (): IController;
  }
}
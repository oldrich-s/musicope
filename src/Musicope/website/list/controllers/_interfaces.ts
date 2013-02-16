/// <reference path="../_references.ts" />
module IList {

  export interface ISong {
    path: string;
    extension: string;
    name: string;
    url: string;
  }

  export interface IController {
    listIndex: KnockoutObservableNumber;
    filteredSongs: KnockoutObservableArray;
    searchQuery: KnockoutObservableString;
    gameParams: KnockoutObservableString;
    redirect(indexFn: () => number, song: ISong);
  }

  export interface IControllerNew {
    new (): IController;
  }
}
/// <reference path="../_references.ts" />

module IList {

  export interface IQueryParams {
    controller: IList.IController;
  }

  export interface IQuery {
    onQueryUpdate(query: string): void;
    onRedirect(displayedSongsIndex: number): IJQuery.JQueryPromise;
  }

  export interface IQueryNew {
    new (params: IQueryParams): IQuery;
  }

}
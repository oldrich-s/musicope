module Musicope.List.Queries {

  export interface IQueryParams {
    controller: Controllers.IController;
  }

  export interface IQuery {
    onQueryUpdate(query: string): void;
    onRedirect(displayedSongsIndex: number): JQueryPromise<any>;
  }

  export interface IQueryNew {
    new (params: IQueryParams): IQuery;
  }

}
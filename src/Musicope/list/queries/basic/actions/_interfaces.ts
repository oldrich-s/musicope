module Musicope.List.Queries.BasicFns.Actions {

  export interface IQueryBasicActionParams {
    inputParams: IQueryParams;
  }

  export interface IQueryBasicAction {
    id: string;
    description: string;
    regexp: RegExp;
    priority: number;
    onQueryUpdate(query: string): void;
    onRedirect?: (displayedSongsIndex: number) => JQueryPromise<any>;
  }

  export interface IQueryBasicActionNew {
    new (params: IQueryBasicActionParams): IQueryBasicAction;
  }

}
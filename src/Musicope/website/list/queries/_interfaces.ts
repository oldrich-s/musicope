/// <reference path="../_references.ts" />

module IList {

  export interface IQueryParams {
  }

  export interface IQuery {}

  export interface IQueryNew {
    new (params: IQueryParams): IQuery;
  }

}
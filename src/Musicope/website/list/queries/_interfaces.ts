/// <reference path="../_references.ts" />

module IList {

  export interface IQueryParams {
    controller: IList.IController;
  }

  export interface IQuery {}

  export interface IQueryNew {
    new (params: IQueryParams): IQuery;
  }

}
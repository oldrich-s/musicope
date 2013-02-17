/// <reference path="../../../_references.ts" />

module IList {

  export interface IQueryBasicActionParams {
    inputParams: IQueryParams;
  }

  export interface IQueryBasicAction {
    id: string;
    description: string;
    query: string;
    triggerAction(): void;
    getCurrentState(): any;
  }

  export interface IQueryBasicActionNew {
    new (params: IQueryBasicActionParams): IQueryBasicAction;
  }

}
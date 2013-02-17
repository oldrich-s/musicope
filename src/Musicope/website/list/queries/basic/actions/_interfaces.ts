/// <reference path="../../../_references.ts" />

module IList {

  export interface IQueryBasicActionParams {
    inputParams: IQueryParams;
  }

  export interface IQueryBasicAction {
    id: string;
    description: string;
    regexp: RegExp;
    priority: number;
    triggerAction(queryMatch: string[]): void;
  }

  export interface IQueryBasicActionNew {
    new (params: IQueryBasicActionParams): IQueryBasicAction;
  }

}
/// <reference path="../../_references.ts" />

//import actionsM = module("./actions/_load");

export class QueryBasic implements IList.IQuery {

  private actions: IList.IQueryBasicAction[] = [];
  private query: string;

  constructor(private params: IList.IQueryParams) {
    var o = this;
    o.initActions();
  }

  private initActions() {
    var o = this;
    var deff = $.Deferred();
    var actionParams: IList.IQueryBasicActionParams = {
      inputParams: o.params
    }
    //for (var prop in actionsM) {
    //  var action = new (<IList.IKeyboardActionsNew> actionsM[prop])(keyboardParams);
    //  o.actions.push(action);
    //}
    deff.resolve(o.actions);
  }

}
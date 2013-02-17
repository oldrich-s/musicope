/// <reference path="../../_references.ts" />

import actionsM = module("./actions/_load");

export class Basic implements IList.IQuery {

  private actions: IList.IQueryBasicAction[] = [];
  private contr: IList.IController;

  constructor(private params: IList.IQueryParams) {
    var o = this;
    o.contr = params.controller;
    o.pushActions();
    o.sortActions();
    o.assignOnQueryChange();
  }

  private pushActions() {
    var o = this;
    var params: IList.IQueryBasicActionParams = {
      inputParams: o.params
    };
    for (var prop in actionsM) {
      var constr: IList.IQueryBasicActionNew = actionsM[prop];
      o.actions.push(new constr(params));
    }
  }

  private sortActions() {
    var o = this;
    o.actions.sort((a, b) => {
      return a.priority > b.priority;
    });
  }

  assignOnQueryChange() {
    var o = this;
    ko.computed(function () {
      var query: string = o.contr.searchQuery();
      o.actions.forEach((action) => {
        var pos = query.search(action.regexp);
        if (pos !== -1) {
          action.triggerAction(query);
        }
      });
    });
  }

}
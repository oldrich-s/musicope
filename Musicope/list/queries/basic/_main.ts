module Musicope.List.Queries {

  export class Basic implements IQuery {

    private actions: BasicFns.Actions.IQueryBasicAction[] = [];
    private contr: Controllers.IController;

    constructor(private params: IQueryParams) {
      var o = this;
      o.contr = params.controller;
      o.pushActions();
      o.sortActions();
    }

    private pushActions() {
      var o = this;
      var params: BasicFns.Actions.IQueryBasicActionParams = {
        inputParams: o.params
      };
      for (var prop in BasicFns.Actions.List) {
        var constr: BasicFns.Actions.IQueryBasicActionNew = BasicFns.Actions.List[prop];
        o.actions.push(new constr(params));
      }
    }

    private sortActions() {
      var o = this;
      o.actions.sort((a, b) => {
        return <any>(a.priority > b.priority);
      });
    }

    onQueryUpdate(query: string) {
      var o = this;
      o.actions.forEach((action) => {
        var pos = query.search(action.regexp);
        if (pos !== -1) {
          action.onQueryUpdate(query);
        }
      });
    }

    onRedirect(displayedSongsIndex: number): JQueryPromise<any> {
      var o = this;
      var promises = [];
      o.actions.forEach((action) => {
        if (action.onRedirect) {
          promises.push(action.onRedirect(displayedSongsIndex));
        }
      });
      return $.when.apply(null, promises);
    }

  }

}
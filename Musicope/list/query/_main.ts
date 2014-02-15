module Musicope.List {

  export class Query {

    private actions: QueryFns.Actions.IQueryBasicAction[] = [];
    private contr: Controller;

    constructor(private params: IQueryParams) {
      var o = this;
      o.contr = params.controller;
      o.pushActions();
      o.sortActions();
    }

    private pushActions() {
      var o = this;
      var params: QueryFns.Actions.IQueryBasicActionParams = {
        inputParams: o.params
      };
      for (var prop in QueryFns.Actions.List) {
        var constr: QueryFns.Actions.IQueryBasicActionNew = QueryFns.Actions.List[prop];
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
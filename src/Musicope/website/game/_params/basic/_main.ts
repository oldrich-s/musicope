module Musicope.Params.Basic {

  export class Basic implements IGame.IParams {

    readOnly: IGame.IParamsData;
    private subscriptions = {};

    constructor() {
      var o = this;
      o.readOnly = getUrlParams(defParams);
    }

    subscribe(id: string, regex: string, callback: (param: string, value: any) => void) {
      var o = this;
      o.subscriptions[id] = {
        regex: new RegExp(regex),
        callback: callback
      };
    }

    unsubscribe(id: string) {
      var o = this;
      delete o.subscriptions[id];
    }

    setParam(name: string, value: any, dontNotifyOthers?: boolean) {
      var o = this
    o.readOnly[name] = value;
      if (!dontNotifyOthers) {
        o.call(name, value);
      }
    }

    areEqual(param1: any, param2: any) {
      if ("every" in param1 && "every" in param2) {
        var areEqual = (<any[]> param1).every((param1i, i) => {
          return param1i == param2[i];
        });
        return areEqual;
      } else {
        return param1 == param2;
      }
    }

    private call(param: string, value: any) {
      var o = this;
      for (var prop in o.subscriptions) {
        var s = o.subscriptions[prop];
        if (param.search(s["regex"]) > -1) {
          s["callback"](param, value);
        }
      }
    }

  }

}
/// <reference path="../../_references.ts" />

import defParams = module("./defaults");
import paramService = module("../../../common/services.params");

export class Basic implements IGame.IParams {

  readOnly: IGame.IParamsData;
  private subscribtions: { regex: RegExp; callback: (param: string, value: any) => void; }[] = [] ;

  constructor() {
    var o = this;
    o.readOnly = paramService.getUrlParams(defParams.params);
  }

  subscribe(regex: string, callback: (param: string, value: any) => void) {
    var o = this;
    o.subscribtions.push({
      regex: new RegExp(regex),
      callback: callback
    });
  }

  setParam(name: string, value: any, dontNotifyOthers?: bool) {
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
    o.subscribtions.forEach((s) => {
      if (param.search(s.regex) > -1) {
        s.callback(param, value);
      }
    });
  }
}
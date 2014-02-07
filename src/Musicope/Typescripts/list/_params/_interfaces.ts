module Musicope.List.Params {

  export interface IParamsData {
    l_songsUrl: string;
  }

  export interface IParams {
    readOnly: IParamsData;
    subscribe(regex: string, callback: (name: string, value: any) => void): void;
    setParam(name: string, value: any, dontNotifyOthers?: boolean): void;
    areEqual(param1: any, param2: any): boolean;
  }

  export interface IParamsNew {
    new (): IParams;
  }

}
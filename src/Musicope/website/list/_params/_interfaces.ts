module IList {

  export interface IParamsData {
    l_songsUrl: string;
  }

  export interface IParams {
    readOnly: IParamsData;
    subscribe(regex: string, callback: (name: string, value: any) => void ): void;
    setParam(name: string, value: any, dontNotifyOthers?: bool): void;
    areEqual(param1: any, param2: any): bool;
  }

  export interface IParamsNew {
    new (): IParams;
  }

}
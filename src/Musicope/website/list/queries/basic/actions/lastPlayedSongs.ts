/// <reference path="../../../_references.ts" />

export class lastPlayedSongs implements IList.IQueryBasicAction {

  id = "last played songs";
  description = "";
  regexp = /^lps$/;
  priority = 10;

  private contr: IList.IController;

  constructor(p: IList.IQueryBasicActionParams) {
    var o = this;
    o.contr = p.inputParams.controller;
  }

  triggerAction(query: string) {
    var o = this;
  }

  private createSongsFromUrls(urls: string[]): IList.ISong[] {
    return urls.map((path) => {
      var vals = path.match(/^(.*\/)([^\/]+)\.([^.]+)$/);
      var song = {
        path: vals[1],
        name: vals[2],
        extension: vals[3],
        url: path
      }
      return ;
    });
  }

}
/// <reference path="../../../_references.ts" />

import toolsM = module("./_tools");

export class filterSongs implements IList.IQueryBasicAction {

  id = "filter songs";
  description = "";
  regexp = /^.*$/;
  priority = 100;

  private contr: IList.IController;

  constructor(p: IList.IQueryBasicActionParams) {
    var o = this;
    o.contr = p.inputParams.controller;
  }

  triggerAction(query: string) {
    var o = this;
    var filteredSongs = o.getFilteredAndColoredSongs(query);
    o.contr.filteredSongs(filteredSongs);
  }

  private getFilteredAndColoredSongs(query: string) {
    var o = this;
    var queries = o.splitQuery(query);
    var filteredSongs = toolsM.filterSongsByQueries(o.contr.songs, queries);
    var slicedSongs = filteredSongs.slice(0, 40);
    var coloredSongs = toolsM.colorSongsByQueries(slicedSongs, queries);
    return coloredSongs;
  }

  private splitQuery(query: string) {
    var queries = query.toLowerCase().split(" ");
    var trimmedQueries: string[] = queries.map((query) => { return query.trim(); });
    var nonEmptyQueries = trimmedQueries.filter((query) => { return query != ""; });
    return nonEmptyQueries;
  }

  

  

}
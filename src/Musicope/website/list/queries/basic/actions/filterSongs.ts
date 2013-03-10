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

  onQueryUpdate(query: string) {
    var o = this;
    var filteredSongs = o.getFilteredAndColoredSongs(query);
    o.contr.displayedSongs(filteredSongs);
  }

  private getFilteredAndColoredSongs(query: string) {
    var o = this;
    var queries = toolsM.splitQuery(query);
    var filteredSongs = toolsM.filterSongsByQueries(o.contr.songs, queries);
    var sortedSongs = o.sortSongs(filteredSongs);
    var slicedSongs = sortedSongs.slice(0, 100);
    var coloredSongs = toolsM.colorSongsByQueries(slicedSongs, queries);
    return coloredSongs;
  }

  private sortSongs(songs: IList.ISong[]) {
    return songs.sort((a, b) => {
      var votesa = a.db["votes"]();
      var votesb = b.db["votes"]();
      if (votesa !== votesb) {
        return votesb - votesa;
      } else {
        return a.name > b.name ? 1 : (a.name === b.name ? 0 : -1);
      }
    });
  }

}
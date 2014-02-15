module Musicope.List.QueryFns.Actions.List {

  export class filterSongs implements IQueryBasicAction {

    id = "filter songs";
    description = "";
    regexp = /^.*$/;
    priority = 100;

    private contr: Controller;

    constructor(p: IQueryBasicActionParams) {
      var o = this;
      o.contr = p.inputParams.controller;
    }

    onQueryUpdate(query: string) {
      var o = this;
      var filteredSongs = o.getFilteredAndColoredSongs(query);
      o.contr.updateFilteredSongs(filteredSongs);
    }

    private getFilteredAndColoredSongs(query: string) {
      var o = this;
      var queries = Tools.splitQuery(query);
      var filteredSongs = Tools.filterSongsByQueries(o.contr.songs, queries);
      var sortedSongs = o.sortSongs(filteredSongs);
      var coloredSongs = Tools.colorSongsByQueries(sortedSongs, queries);
      return coloredSongs;
    }

    private sortSongs(songs: ISong[]) {
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
}
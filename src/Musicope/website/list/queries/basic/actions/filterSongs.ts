/// <reference path="../../../_references.ts" />

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

  triggerAction(queryMatch: string[]) {
    var o = this;
  }

  private filterSongs(query: string) {
    var o = this;
    var queries = o.splitQuery(query);
    var filteredSongs = o.filterSongsByQueries(queries);
    var slicedSongs = filteredSongs.slice(0, 40);
    var coloredSongs = o.colorSongsByQueries(slicedSongs, queries);
    return coloredSongs;
  }

  private splitQuery(query: string) {
    var queries = query.toLowerCase().split(" ");
    var trimmedQueries = queries.map((query) => { return query.trim(); });
    var nonEmptyQueries = trimmedQueries.filter((query) => { return query != ""; });
    return nonEmptyQueries;
  }

  private filterSongsByQueries(queries: string[]) {
    var o = this;
    return o.contr.songs.filter((song, i) => {
      var url = song.url.toLowerCase();
      return queries.every((query) => {
        return url.indexOf(query) > -1;
      });
    });
  }

  private colorSongsByQueries(songs: IList.ISong[], queries: string[]) {
    function color(str: string) {
      queries.forEach((query) => {
        str = str.replace(new RegExp(query, 'gi'), '{$&}');
      });
      for (var i = 0; i < queries.length; i++) {
        str = str.replace(/\{([^{]+?)\}/g, '<span class="search-match">$1</span>');
      }
      return str;
    }
    return songs.map((song) => {
      if (queries.length > 0 && queries[0].length > 0) {
        var coloredName = color(song.name);
        var coloredPath = color(song.path);
        return { name: coloredName, path: coloredPath, url: song.url };
      } else { return <any>song; }
    });
  }

}
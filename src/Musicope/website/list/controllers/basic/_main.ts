/// <reference path="../../_references.ts" />

import paramsM = module("../../_params/_load");
import localM = module("../../../common/services.local");
import inputsM = module("../../inputs/_load");
import lastPlayedSongs = module("./lastPlayedSongs");

var params = new paramsM.Basic();
var o: Basic;

export class Basic implements IList.IController {

  listIndex: KnockoutObservableNumber;
  filteredSongs: KnockoutObservableArray;
  searchQuery: KnockoutObservableString;
  gameParams: KnockoutObservableString;

  songs: IList.ISong[] = [];
  private pouch: ph.DB;

  constructor() {
    o = this;
    o.initGameParams();
    o.initSearchQuery();
    o.initListIndex();
    o.initFilteredSongs();
    o.loadSongs();
    o.initInputs();
    o.scrollToFocusedEl();
  }

  redirect(indexFn: () => number, song: IList.ISong) {
    localM.set("listIndex", indexFn());
    lastPlayedSongs.add(song.url).done(() => {
      var pars: string = o.gameParams();
      if (!pars) { pars = ""; }
      if (pars.charAt(0) !== "&") { pars = "&" + pars; }
      window.location.href = "../game/index.html?c_songUrl=" + decodeURIComponent(song.url) + pars;
    });
  }

  private scrollToFocusedEl() {
    var el = $(".elFocus");
    if (el && el.length > 0) {
      var index = o.listIndex();
      var rely: number = el.offset()["top"] - $(window).scrollTop();
      var dy = 0.5 * window.innerHeight - rely;
      $(window).scrollTop($(window).scrollTop() - dy);
    } else {
      setTimeout(o.scrollToFocusedEl, 100);
    }
  }

  private initGameParams() {
    o.gameParams = ko.observable(localM.get("gameParams", ""));
    o.gameParams.subscribe((query) => { localM.set("gameParams", query); });
  }

  private initSearchQuery() {
    var initQuery = localM.get("query", "");
    o.searchQuery = ko.observable(initQuery);
    o.searchQuery.subscribe((query) => {
      if (query !== initQuery) {
        o.listIndex(0);
      }
      localM.set("query", query);
    });
  }

  private initListIndex() {
    o.listIndex = ko.observable(localM.get("listIndex", 0));
    o.listIndex.subscribe((i) => { localM.set("listIndex", i); });
  }

  private loadSongs() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', params.readOnly.l_songsUrl);
    xhr.responseType = 'text';
    xhr.onload = function (e) {
      if (this.status == 200) {
        var paths = JSON.parse(this.responseText);
        o.songs = o.createSongsFromUrls(paths);
        o.searchQuery.valueHasMutated();
      }
    }
    xhr.send();
  }

  private initInputs() {
    var o = this;
    var params: IList.IInputParams = {
      controller: o
    };
    for (var prop in inputsM) {
      new (<IList.IInputNew> inputsM[prop])(params);
    }
  }

  private createSongsFromUrls(urls: string[]): IList.ISong[] {
    return urls.map((path) => {
      var vals = path.match(/^(.*\/)([^\/]+)\.([^.]+)$/);
      return { path: vals[1], name: vals[2], extension: vals[3], url: path };
    });
  }

  private initFilteredSongs() {
    o.filteredSongs = ko.observableArray();
    ko.computed(function () {
      var query: string = o.searchQuery();
      if (query === "ls") {
        lastPlayedSongs.getAll().done((songs: lastPlayedSongs.LastPlayedSong[]) => {
          var songUrls = songs.map((song) => {
            return song.url;
          });
          if (songUrls.length == 0) {
            o.filteredSongs(o.filterSongs(query));
          } else {
            o.filteredSongs(o.createSongsFromUrls(songUrls));
          }

        });
      } else {
        o.filteredSongs(o.filterSongs(query));
      }
    });
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
    return o.songs.filter((song, i) => {
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
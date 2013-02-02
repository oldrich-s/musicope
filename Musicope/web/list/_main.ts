/// <reference path="_references.ts" />

import defParams = module("./_paramsDefault");
import paramService = module("../common/services.params");
import inputs = module("./inputs/_load");

var params: IParams = paramService.getUrlParams();
var ctrlParams: IListParams = paramService.copy(params, defParams.iListParams);

interface ISong { path: string; extension: string; name: string; url: string; }

class AppViewModel {

  filteredSongs: KnockoutComputed;
  searchQuery = ko.observable(localStorage.getItem("query") || "");
  gameParams = ko.observable(localStorage.getItem("params") || "");
  private songs: ISong[] = [];
  private paths: string[];

  constructor() {
    var o = this;

    o.gameParams.subscribe((params) => { localStorage.setItem("params", params); });
    o.searchQuery.subscribe((query) => { localStorage.setItem("query", query); });

    o.initFilteredSongs();
    o.loadSongs();

  }

  constructURL(songUrl) {
    var pars: string = this.gameParams();
    if (pars.charAt(0) !== "&") { pars = "&" + pars; }
    return "../game/index.html?c_songUrl=" + decodeURIComponent(songUrl) + pars;
  }

  private loadSongs() {
    var o = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', ctrlParams.songsUrl);
    xhr.responseType = 'text';
    xhr.onload = function (e) {
      if (this.status == 200) {
        o.paths = JSON.parse(this.responseText);
        o.songs = o.paths.map((path) => {
          var vals = path.match(/^(.*\/)([^\/]+)\.([^.]+)$/);
          return {path: vals[1], name: vals[2], extension: vals[3], url: path};
        });
        o.searchQuery.valueHasMutated();
      }
    }
    xhr.send();
  }

  private initFilteredSongs() {
    var o = this;
    function replace(where: string, what: string) { return where.replace(new RegExp(what, 'gi'), '<span class="search-match">$&</span>'); }

    o.filteredSongs = ko.computed(function () {
      var query = o.searchQuery();
      var queries = query.toLowerCase().split(" ");
      var songs = o.songs.filter((song, i) => {
        var path = o.paths[i].toLowerCase();
        return queries.every((query) => {
          return path.indexOf(query) > -1;
        });
      });
      var slicedSongs = songs.slice(0, 20);
      var coloredSongs = slicedSongs.map((song) => {
        if (query.length > 0) {
          var name = queries.map((query) => {
            return replace(song.name, query);
          });
          var path = queries.map((query) => {
            return replace(song.path, query);
          });
          return { name: name, path: path, url: song.url };
        } else { return <any>song; }
      });
      return coloredSongs;
    });
  }

}

ko.applyBindings(new AppViewModel());
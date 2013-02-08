/// <reference path="_references.ts" />

import defParams = module("./_paramsDefault");
import paramService = module("../common/services.params");
import local = module("../common/services.local");
import inputs = module("./inputs/_load");
import lastPlayedSongs = module("./lastPlayedSongs");

var params: IParams = paramService.getUrlParams(defParams.iListParams);

interface ISong { path: string; extension: string; name: string; url: string; }

var o: AppViewModel;

class AppViewModel {

  templates: KnockoutObservableArray;
  selectedTemplate: KnockoutObservableString;
  filteredSongs: KnockoutObservableArray;
  searchQuery: KnockoutObservableString;
  gameParams: KnockoutComputed;
  private songs: ISong[] = [];
  private pouch: ph.DB;

  constructor() {
    o = this;
    o.initTemplates();
    o.initSelectedTemplate();
    o.initGameParams();
    o.initSearchQuery();
    o.initFilteredSongs();
    o.loadSongs();
  }

  redirect(song: ISong) {
    lastPlayedSongs.add(song.url).done(() => {
      var pars: string = o.gameParams();
      if (!pars) { pars = ""; }
      if (pars.charAt(0) !== "&") { pars = "&" + pars; }
      window.location.href = "../game/index.html?c_songUrl=" + decodeURIComponent(song.url) + pars;
    });
  }

  private initTemplates() {
    var o = this;
    var defaultTemplates = [
      { name: "none", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_userHands=[false,false]" },
      { name: "left", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_userHands=[true,false]" },
      { name: "right", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_userHands=[false,true]" },
      { name: "both", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_userHands=[true,true]" },
      { name: "wait for left", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[1,1]&p_userHands=[true,false]" },
      { name: "wait for right", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[1,1]&p_userHands=[false,true]" },
      { name: "wait for both", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[1,1]&p_userHands=[true,true]" }
    ];
    var templates = local.get("templates", defaultTemplates);
    o.templates = ko.observableArray(templates);
    o.templates.subscribe((templates) => {
      local.set("templates", JSON.stringify(templates));
    });
  }

  private initSelectedTemplate() {
    var template = local.get("selectedTemplate", "");
    o.selectedTemplate = ko.observable(template);
    o.selectedTemplate.subscribe((template) => {
      local.set("selectedTemplate", template);
    });
  }

  private initGameParams() {
    o.gameParams = ko.computed(() => {
      var selectedName = o.selectedTemplate();
      var selectedTemplates = o.templates().filter((templ) => {
        return templ["name"] == selectedName;
      });
      if (selectedTemplates.length > 0) {
        return selectedTemplates[0]["value"];
      }
    });
    o.gameParams.subscribe((params) => { local.set("params", params); });
  }

  private initSearchQuery() {
    o.searchQuery = ko.observable(local.get("query", ""));
    o.searchQuery.subscribe((query) => { local.set("query", query); });
  }

  private loadSongs() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', params.l_songsUrl);
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

  private createSongsFromUrls(urls: string[]): ISong[] {
    return urls.map((path) => {
      var vals = path.match(/^(.*\/)([^\/]+)\.([^.]+)$/);
      return { path: vals[1], name: vals[2], extension: vals[3], url: path };
    });
  }

  private initFilteredSongs() {
    o.filteredSongs = ko.observableArray();
    ko.computed(function () {
      var query: string = o.searchQuery();
      if (query.length == 0) {
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

  private colorSongsByQueries(songs: ISong[], queries: string[]) {
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

ko.applyBindings(new AppViewModel());
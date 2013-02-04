/// <reference path="_references.ts" />

import defParams = module("./_paramsDefault");
import paramService = module("../common/services.params");
import local = module("../common/services.local");
import inputs = module("./inputs/_load");
import lastPlayedSongs = module("./lastPlayedSongs");

var params: IParams = paramService.getUrlParams();
var ctrlParams: IListParams = paramService.copy(params, defParams.iListParams);

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
      if (pars.charAt(0) !== "&") { pars = "&" + pars; }
      window.location.href = "../game/index.html?c_songUrl=" + decodeURIComponent(song.url) + pars;
    });
  }

  private initTemplates() {
    var o = this;
    var defaultTemplates = [
      {name: "none", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_volumes=[1,1]"},
      {name: "left", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_volumes=[0,1]"},
      {name: "right", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_volumes=[1,0]"},
      {name: "both", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_volumes=[0,0]"},
      {name: "waitLeft", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[1,1]&p_volumes=[0,1]"},
      {name: "waitRight", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[1,1]&p_volumes=[1,0]"},
      {name: "waitBoth", value: "p_deviceIn=0&p_deviceOut=1&p_waits=[1,1]&p_volumes=[0,0]"}
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
    xhr.open('GET', ctrlParams.songsUrl);
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
      return {path: vals[1], name: vals[2], extension: vals[3], url: path};
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
    function replace(where: string, what: string) { return where.replace(new RegExp(what, 'gi'), '<span class="search-match">$&</span>'); }
    var queries = query.toLowerCase().split(" ");
    var songs = o.songs.filter((song, i) => {
      var path = song.url.toLowerCase();
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
  }

}

ko.applyBindings(new AppViewModel());
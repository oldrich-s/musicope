/// <reference path="../../_references.ts" />

import paramsM = module("../../_params/_load");
import localM = module("../../../common/services.local");
import inputsM = module("../../inputs/_load");
import queriesM = module("../../queries/_load");

var params = new paramsM.Basic();
var o: Basic;

export class Basic implements IList.IController {

  gameParams: KnockoutObservableString;
  searchQuery: KnockoutObservableString;
  displayedSongs = ko.observableArray();
  listIndex: KnockoutObservableNumber;

  songs: IList.ISong[] = [];

  private queryManager: IList.IQuery;

  constructor() {
    o = this;
    o.koInitGameParams();
    o.koInitSearchQuery();
    o.koInitListIndex();
    o.initInputs();
    o.loadSongs();
    o.scrollToFocusedEl();
    o.initQueryManager();
    o.assignOnQueryUpdate();
  }

  redirect(indexFn: () => number, song: IList.ISong) {
    var o = this;
    var index = indexFn();
    localM.set("listIndex", index);
    o.queryManager.onRedirect(index).done(() => {
      var pars: string = o.gameParams();
      if (!pars) { pars = ""; }
      if (pars.charAt(0) !== "&") { pars = "&" + pars; }
      window.location.href = "../game/index.html?c_songUrl=" + decodeURIComponent(song.url) + pars;
    });
  }

  private koInitGameParams() {
    o.gameParams = ko.observable(localM.get("gameParams", ""));
    o.gameParams.subscribe((query) => { localM.set("gameParams", query); });
  }

  private koInitSearchQuery() {
    var initQuery = localM.get("query", "");
    o.searchQuery = ko.observable(initQuery);
    o.searchQuery.subscribe((query) => {
      if (query !== initQuery) {
        o.listIndex(0);
      }
      localM.set("query", query);
    });
  }

  private koInitListIndex() {
    o.listIndex = ko.observable(localM.get("listIndex", 0));
    o.listIndex.subscribe((i) => { localM.set("listIndex", i); });
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

  private loadSongs() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', params.readOnly.l_songsUrl);
    xhr.responseType = 'text';
    xhr.onload = function (e) {
      if (this.status == 200) {
        var paths = JSON.parse(this.responseText);
        o.songs = o.getSongsFromUrls(paths);
        o.searchQuery.valueHasMutated();
      }
    }
    xhr.send();
  }

  private getSongsFromUrls(urls: string[]) {
    var songs: IList.ISong[] = urls.map((path) => {
      var vals = path.match(/^(.*\/)([^\/]+)\.([^.]+)$/);
      var song: IList.ISong = {
        path: vals[1],
        name: vals[2],
        extension: vals[3],
        url: path
      };
      return song;
    });
    return songs;
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

  private initQueryManager() {
    var params: IList.IQueryParams = {
      controller: o
    };
    o.queryManager = new queriesM.basic(params);
  }

  private assignOnQueryUpdate() {
    var o = this;
    ko.computed(() => {
      var query: string = o.searchQuery();
      o.queryManager.onQueryUpdate(query);
    });
  }

}
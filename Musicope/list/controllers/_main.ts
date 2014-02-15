module Musicope.List {

  export class Controller {

    gameParams: KnockoutObservable<string>;
    searchQuery: KnockoutObservable<string>;
    displayedSongs = ko.observableArray<ISong>([]);
    listIndex: KnockoutObservable<number>;

    songs: ISong[] = [];
    filteredSongs: ISong[] = [];

    private queryManager: Query;
    private params = new Params();

    constructor() {
      var o = this;
      o = this;
      o.koInitGameParams();
      o.koInitSearchQuery();
      o.koInitListIndex();
      o.initInputs();

      var songs = new ControllersFns.Songs();

      songs.getSongList(o.params).done((songs: ISong[]) => {
        o.songs = songs;
        o.searchQuery.valueHasMutated();
      });

      o.scrollToFocusedEl();
      o.initQueryManager();
      o.assignOnQueryUpdate();
      o.assignCorrectVisibility();
    }

    redirect(indexFn: () => number, song: ISong) {
      var o = this;
      var index = indexFn();
      LocStorage.set("listIndex", index);
      o.queryManager.onRedirect(index).done(() => {
        var pars: string = o.gameParams();
        if (!pars) { pars = ""; }
        if (pars.charAt(0) !== "&") { pars = "&" + pars; }
        window.location.href = "../game/index.html?c_songUrl=" + encodeURIComponent(song.url) + pars;
      });
    }

    showGameParamsSetup() {
      $('gameParamsSetup').css("display", "block");
    }

    correctPosition(dom) {
      var el = $(dom);
      var rely: number = el.offset()["top"] - $(window).scrollTop() + 0.5 * el.height();
      if (rely > 0.9 * window.innerHeight) {
        var dy = window.innerHeight - 1.5 * el.height() - rely;
        $(window).scrollTop($(window).scrollTop() - dy);
      } else if (rely < 0.2 * window.innerHeight) {
        $(window).scrollTop(el.offset()["top"] - 2 * el.height());
      }
      return true;
    }

    updateFilteredSongs(songs: ISong[]) {
      var o = this;
      o.filteredSongs = songs;
      var length = Math.min(o.listIndex() + 10, songs.length);
      o.displayedSongs(songs.slice(0, length));
    }

    private koInitGameParams = () => {
      var o = this;
      o.gameParams = ko.observable(LocStorage.get("gameParams", ""));
      o.gameParams.subscribe((query) => { LocStorage.set("gameParams", query); });
    }

    private koInitSearchQuery = () => {
      var o = this;
      var initQuery = LocStorage.get("query", "");
      o.searchQuery = ko.observable(initQuery);
      o.searchQuery.subscribe((query) => {
        if (query !== initQuery) {
          o.listIndex(0);
        }
        LocStorage.set("query", query);
      });
    }

    private koInitListIndex = () => {
      var o = this;
      o.listIndex = ko.observable(LocStorage.get("listIndex", 0));
      o.listIndex.subscribe((i) => { LocStorage.set("listIndex", i); });
    }

    private initInputs = () => {
      var o = this;
      var params: Inputs.IInputParams = {
        controller: o
      };
      for (var prop in Inputs.List) {
        new (<Inputs.IInputNew> Inputs.List[prop])(params);
      }
    }

    private scrollToFocusedEl = () => {
      var o = this;
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

    private initQueryManager = () => {
      var o = this;
      var params: IQueryParams = {
        controller: o
      };
      o.queryManager = new Query(params);
    }

    private assignOnQueryUpdate = () => {
      var o = this;
      o.searchQuery.subscribe((query) => {
        o.queryManager.onQueryUpdate(query);
      });
    }

    private assignCorrectVisibility = () => {
      var o = this;
      $(window).scroll((e) => {
        var scrollEnd = $(document).height() - $(window).scrollTop() - $(window).height();
        if (scrollEnd < 100) {
          var songs = o.displayedSongs();
          var length = songs.length;
          for (var i = length; i < length + 10; i++) {
            if (o.filteredSongs[i]) {
              songs.push(o.filteredSongs[i]);
            }
          }
          o.displayedSongs.valueHasMutated();
        }
      });
    }

  }

}
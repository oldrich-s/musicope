/// <reference path="../../../_references.ts" />

interface LastPlayedSong {
  url: string;
  num: number;
}

export class lastPlayedSongs implements IList.IQueryBasicAction {

  id = "last played songs";
  description = "";
  regexp = /^lps$/;
  priority = 10;

  private contr: IList.IController;

  constructor(p: IList.IQueryBasicActionParams) {
    var o = this;
    o.contr = p.inputParams.controller;
  }

  onQueryUpdate(query: string) {
    var o = this;
    o.getAllSortedLastPlayedSongs();
  }

  onRedirect(displayedSongsIndex: number) {
    var o = this;
    var song: IList.ISong = o.contr.displayedSongs()[displayedSongsIndex];
    return o.addUrlToLastPlayedSongs(song.url);
  }

  private getAllSortedLastPlayedSongs() {
    var o = this;
    var done = $.Deferred();
    new Pouch("idb://musicope", (err, db) => {
      db.get("lastPlayedSongs", (err, data) => {
        if (data && data["songs"]) {
          var sortedSongs = o.sortSongsByUrl(data["songs"]);
          done.resolve(sortedSongs, data, db);
        } else {
          done.resolve([], {}, db);
        }
      });
    });
    return done.promise();
  }

  private sortSongsByUrl(songs: LastPlayedSong[]) {
    var sortedSongs = songs.sort((a, b) => {
      if (a.num === b.num) {
        var x = a.url.toLowerCase(), y = b.url.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      }
      return b.num - a.num;
    });
    return sortedSongs;
  }

  private addUrlToLastPlayedSongs(url: string) {
    var o = this;
    var done = $.Deferred();
    o.getAllSortedLastPlayedSongs().done(
      (songs: LastPlayedSong[], data, db: ph.DB) => {
        var index = o.indexOfSameUrl(data["songs"], url);
        if (index !== -1) {
          songs.push({ url: url, num: 0 });
          if (songs.length > 20) { songs.shift(); }
        }
        data["songs"][index]["num"]++;
        data["songs"] = songs;
        if (!data["_id"]) {
          data["_id"] = "lastPlayedSongs";
        }
        db.put(data, (err, response) => {
          if (!err) {
            done.resolve();
          }
        });
      });
    return done.promise();
  }

  private indexOfSameUrl(songs: LastPlayedSong[], url: string) {
    for (var i = 0; i < songs.length; i++) {
      if (songs[i].url === url) {
        return i;
      }
    }
    return -1;
  }

}
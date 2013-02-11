/// <reference path="_references.ts" />

export interface LastPlayedSong {
  url: string;
  num: number;
}

export function getAll() {
  var done = $.Deferred();
  new Pouch("idb://musicope", (err, db) => {
    db.get("lastPlayedSongs", (err, data) => {
      if (data && data["songs"]) {
        var sortedSongs = data["songs"].sort((a, b) => {
          if (a.num === b.num) {
            var x = a.url.toLowerCase(), y = b.url.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
          }
          return b.num - a.num;
        });
        done.resolve(sortedSongs, data, db);
      } else {
        done.resolve([], {}, db);
      }
    });
  });
  return done;
}

export function add(url: string) {
  var done = $.Deferred();
  getAll().done((songs: LastPlayedSong [], data, db: ph.DB) => {
    var found = false;
    songs.forEach((song) => {
      if (song.url === url) {
        song.num++;
        found = true;
      }
    });
    if (!found) {
      songs.push({ url: url, num: 1 });
      if (songs.length > 20) { songs.shift(); }
    }
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
  return done;
}
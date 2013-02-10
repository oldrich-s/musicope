define(["require", "exports"], function(require, exports) {
    function getAll() {
        var done = $.Deferred();
        new Pouch("idb://musicope", function (err, db) {
            db.get("lastPlayedSongs", function (err, data) {
                if(data && data["songs"]) {
                    var sortedSongs = data["songs"].sort(function (a, b) {
                        if(a.num === b.num) {
                            var x = a.url.toLowerCase(), y = b.url.toLowerCase();
                            return x < y ? -1 : x > y ? 1 : 0;
                        }
                        return b.num - a.num;
                    });
                    done.resolve(sortedSongs, data, db);
                } else {
                    done.resolve([], {
                    }, db);
                }
            });
        });
        return done;
    }
    exports.getAll = getAll;
    function add(url) {
        var done = $.Deferred();
        getAll().done(function (songs, data, db) {
            var found = false;
            songs.forEach(function (song) {
                if(song.url === url) {
                    song.num++;
                    found = true;
                }
            });
            if(!found) {
                songs.push({
                    url: url,
                    num: 1
                });
                if(songs.length > 20) {
                    songs.shift();
                }
            }
            data["songs"] = songs;
            if(!data["_id"]) {
                data["_id"] = "lastPlayedSongs";
            }
            db.put(data, function (err, response) {
                if(!err) {
                    done.resolve();
                }
            });
        });
        return done;
    }
    exports.add = add;
})
//@ sourceMappingURL=lastPlayedSongs.js.map

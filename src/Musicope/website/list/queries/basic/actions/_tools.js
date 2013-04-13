define(["require", "exports"], function(require, exports) {
    /// <reference path="../../../_references.ts" />
    function colorStringByQueries(str, queries) {
        queries.forEach(function (query) {
            str = str.replace(new RegExp(query, 'gi'), '{$&}');
        });
        for(var i = 0; i < queries.length; i++) {
            str = str.replace(/\{([^{]+?)\}/g, '<span class="search-match">$1</span>');
        }
        return str;
    }
    function colorSongByQueries(song, queries) {
        var coloredName = colorStringByQueries(song.name, queries);
        var coloredPath = colorStringByQueries(song.path, queries);
        var coloredSong = {
            name: coloredName,
            path: coloredPath,
            url: song.url,
            db: song.db,
            extension: song.extension
        };
        return coloredSong;
    }
    function colorSongsByQueries(songs, queries) {
        var coloredSongs = songs.map(function (song) {
            if(queries.length > 0 && queries[0].length > 0) {
                return colorSongByQueries(song, queries);
            } else {
                return song;
            }
        });
        return coloredSongs;
    }
    exports.colorSongsByQueries = colorSongsByQueries;
    function filterSongsByQueries(songs, queries) {
        return songs.filter(function (song, i) {
            var url = song.url.toLowerCase();
            return queries.every(function (query) {
                return url.indexOf(query) > -1;
            });
        });
    }
    exports.filterSongsByQueries = filterSongsByQueries;
    function splitQuery(query) {
        var queries = query.toLowerCase().split(" ");
        var trimmedQueries = queries.map(function (query) {
            return query.trim();
        });
        var nonEmptyQueries = trimmedQueries.filter(function (query) {
            return query != "";
        });
        return nonEmptyQueries;
    }
    exports.splitQuery = splitQuery;
})
//@ sourceMappingURL=_tools.js.map

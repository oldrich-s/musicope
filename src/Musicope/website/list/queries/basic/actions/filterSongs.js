define(["require", "exports", "./_tools"], function(require, exports, __toolsM__) {
    /// <reference path="../../../_references.ts" />
    var toolsM = __toolsM__;

    var filterSongs = (function () {
        function filterSongs(p) {
            this.id = "filter songs";
            this.description = "";
            this.regexp = /^.*$/;
            this.priority = 100;
            var o = this;
            o.contr = p.inputParams.controller;
        }
        filterSongs.prototype.onQueryUpdate = function (query) {
            var o = this;
            var filteredSongs = o.getFilteredAndColoredSongs(query);
            o.contr.updateFilteredSongs(filteredSongs);
        };
        filterSongs.prototype.getFilteredAndColoredSongs = function (query) {
            var o = this;
            var queries = toolsM.splitQuery(query);
            var filteredSongs = toolsM.filterSongsByQueries(o.contr.songs, queries);
            var sortedSongs = o.sortSongs(filteredSongs);
            var coloredSongs = toolsM.colorSongsByQueries(sortedSongs, queries);
            return coloredSongs;
        };
        filterSongs.prototype.sortSongs = function (songs) {
            return songs.sort(function (a, b) {
                var votesa = a.db["votes"]();
                var votesb = b.db["votes"]();
                if(votesa !== votesb) {
                    return votesb - votesa;
                } else {
                    return a.name > b.name ? 1 : (a.name === b.name ? 0 : -1);
                }
            });
        };
        return filterSongs;
    })();
    exports.filterSongs = filterSongs;    
})
//@ sourceMappingURL=filterSongs.js.map

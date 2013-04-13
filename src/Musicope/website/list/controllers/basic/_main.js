define(["require", "exports", "../../_params/_load", "../../../common/services.local", "../../inputs/_load", "../../queries/_load", "./songs"], function(require, exports, __paramsM__, __localM__, __inputsM__, __queriesM__, __songsM__) {
    /// <reference path="../../_references.ts" />
    var paramsM = __paramsM__;

    var localM = __localM__;

    var inputsM = __inputsM__;

    var queriesM = __queriesM__;

    var songsM = __songsM__;

    var o;
    var Basic = (function () {
        function Basic() {
            this.displayedSongs = ko.observableArray([]);
            this.songs = [];
            this.filteredSongs = [];
            this.params = new paramsM.Basic();
            o = this;
            o.koInitGameParams();
            o.koInitSearchQuery();
            o.koInitListIndex();
            o.initInputs();
            songsM.getSongList(o.params).done(function (songs) {
                o.songs = songs;
                o.searchQuery.valueHasMutated();
            });
            o.scrollToFocusedEl();
            o.initQueryManager();
            o.assignOnQueryUpdate();
            o.assignCorrectVisibility();
        }
        Basic.prototype.redirect = function (indexFn, song) {
            var o = this;
            var index = indexFn();
            localM.set("listIndex", index);
            o.queryManager.onRedirect(index).done(function () {
                var pars = o.gameParams();
                if(!pars) {
                    pars = "";
                }
                if(pars.charAt(0) !== "&") {
                    pars = "&" + pars;
                }
                window.location.href = "../game/index.html?c_songUrl=" + encodeURIComponent(song.url) + pars;
            });
        };
        Basic.prototype.showGameParamsSetup = function () {
            $('gameParamsSetup').css("display", "block");
        };
        Basic.prototype.correctPosition = function (dom) {
            var el = $(dom);
            var rely = el.offset()["top"] - $(window).scrollTop() + 0.5 * el.height();
            if(rely > 0.9 * window.innerHeight) {
                var dy = window.innerHeight - 1.5 * el.height() - rely;
                $(window).scrollTop($(window).scrollTop() - dy);
            } else if(rely < 0.2 * window.innerHeight) {
                $(window).scrollTop(el.offset()["top"] - 2 * el.height());
            }
            return true;
        };
        Basic.prototype.updateFilteredSongs = function (songs) {
            var o = this;
            o.filteredSongs = songs;
            var length = Math.min(o.listIndex() + 10, songs.length);
            o.displayedSongs(songs.slice(0, length));
        };
        Basic.prototype.koInitGameParams = function () {
            o.gameParams = ko.observable(localM.get("gameParams", ""));
            o.gameParams.subscribe(function (query) {
                localM.set("gameParams", query);
            });
        };
        Basic.prototype.koInitSearchQuery = function () {
            var initQuery = localM.get("query", "");
            o.searchQuery = ko.observable(initQuery);
            o.searchQuery.subscribe(function (query) {
                if(query !== initQuery) {
                    o.listIndex(0);
                }
                localM.set("query", query);
            });
        };
        Basic.prototype.koInitListIndex = function () {
            o.listIndex = ko.observable(localM.get("listIndex", 0));
            o.listIndex.subscribe(function (i) {
                localM.set("listIndex", i);
            });
        };
        Basic.prototype.initInputs = function () {
            var o = this;
            var params = {
                controller: o
            };
            for(var prop in inputsM) {
                new (inputsM[prop])(params);
            }
        };
        Basic.prototype.scrollToFocusedEl = function () {
            var el = $(".elFocus");
            if(el && el.length > 0) {
                var index = o.listIndex();
                var rely = el.offset()["top"] - $(window).scrollTop();
                var dy = 0.5 * window.innerHeight - rely;
                $(window).scrollTop($(window).scrollTop() - dy);
            } else {
                setTimeout(o.scrollToFocusedEl, 100);
            }
        };
        Basic.prototype.initQueryManager = function () {
            var params = {
                controller: o
            };
            o.queryManager = new queriesM.basic(params);
        };
        Basic.prototype.assignOnQueryUpdate = function () {
            var o = this;
            o.searchQuery.subscribe(function (query) {
                o.queryManager.onQueryUpdate(query);
            });
        };
        Basic.prototype.assignCorrectVisibility = function () {
            var o = this;
            $(window).scroll(function (e) {
                var scrollEnd = $(document).height() - $(window).scrollTop() - $(window).height();
                if(scrollEnd < 100) {
                    var songs = o.displayedSongs();
                    var length = songs.length;
                    for(var i = length; i < length + 10; i++) {
                        if(o.filteredSongs[i]) {
                            songs.push(o.filteredSongs[i]);
                        }
                    }
                    o.displayedSongs.valueHasMutated();
                }
            });
        };
        return Basic;
    })();
    exports.Basic = Basic;    
})
//@ sourceMappingURL=_main.js.map

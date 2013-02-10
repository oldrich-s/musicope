define(["require", "exports", "./_paramsDefault", "../common/services.params", "../common/services.local", "./lastPlayedSongs"], function(require, exports, __defParams__, __paramService__, __local__, __lastPlayedSongs__) {
    /// <reference path="_references.ts" />
    var defParams = __defParams__;

    var paramService = __paramService__;

    var local = __local__;

    
    var lastPlayedSongs = __lastPlayedSongs__;

    var params = paramService.getUrlParams(defParams.iListParams);
    var o;
    var AppViewModel = (function () {
        function AppViewModel() {
            this.songs = [];
            o = this;
            o.initTemplates();
            o.initSelectedTemplate();
            o.initGameParams();
            o.initSearchQuery();
            o.initFilteredSongs();
            o.loadSongs();
        }
        AppViewModel.prototype.redirect = function (song) {
            lastPlayedSongs.add(song.url).done(function () {
                var pars = o.gameParams();
                if(!pars) {
                    pars = "";
                }
                if(pars.charAt(0) !== "&") {
                    pars = "&" + pars;
                }
                window.location.href = "../game/index.html?c_songUrl=" + decodeURIComponent(song.url) + pars;
            });
        };
        AppViewModel.prototype.initTemplates = function () {
            var o = this;
            var defaultTemplates = [
                {
                    name: "none",
                    value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_userHands=[false,false]"
                }, 
                {
                    name: "left",
                    value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_userHands=[true,false]"
                }, 
                {
                    name: "right",
                    value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_userHands=[false,true]"
                }, 
                {
                    name: "both",
                    value: "p_deviceIn=0&p_deviceOut=1&p_waits=[0,0]&p_userHands=[true,true]"
                }, 
                {
                    name: "wait for left",
                    value: "p_deviceIn=0&p_deviceOut=1&p_waits=[1,1]&p_userHands=[true,false]"
                }, 
                {
                    name: "wait for right",
                    value: "p_deviceIn=0&p_deviceOut=1&p_waits=[1,1]&p_userHands=[false,true]"
                }, 
                {
                    name: "wait for both",
                    value: "p_deviceIn=0&p_deviceOut=1&p_waits=[1,1]&p_userHands=[true,true]"
                }
            ];
            var templates = local.get("templates", defaultTemplates);
            o.templates = ko.observableArray(templates);
            o.templates.subscribe(function (templates) {
                local.set("templates", JSON.stringify(templates));
            });
        };
        AppViewModel.prototype.initSelectedTemplate = function () {
            var template = local.get("selectedTemplate", "");
            o.selectedTemplate = ko.observable(template);
            o.selectedTemplate.subscribe(function (template) {
                local.set("selectedTemplate", template);
            });
        };
        AppViewModel.prototype.initGameParams = function () {
            o.gameParams = ko.computed(function () {
                var selectedName = o.selectedTemplate();
                var selectedTemplates = o.templates().filter(function (templ) {
                    return templ["name"] == selectedName;
                });
                if(selectedTemplates.length > 0) {
                    return selectedTemplates[0]["value"];
                }
            });
            o.gameParams.subscribe(function (params) {
                local.set("params", params);
            });
        };
        AppViewModel.prototype.initSearchQuery = function () {
            o.searchQuery = ko.observable(local.get("query", ""));
            o.searchQuery.subscribe(function (query) {
                local.set("query", query);
            });
        };
        AppViewModel.prototype.loadSongs = function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', params.l_songsUrl);
            xhr.responseType = 'text';
            xhr.onload = function (e) {
                if(this.status == 200) {
                    var paths = JSON.parse(this.responseText);
                    o.songs = o.createSongsFromUrls(paths);
                    o.searchQuery.valueHasMutated();
                }
            };
            xhr.send();
        };
        AppViewModel.prototype.createSongsFromUrls = function (urls) {
            return urls.map(function (path) {
                var vals = path.match(/^(.*\/)([^\/]+)\.([^.]+)$/);
                return {
                    path: vals[1],
                    name: vals[2],
                    extension: vals[3],
                    url: path
                };
            });
        };
        AppViewModel.prototype.initFilteredSongs = function () {
            o.filteredSongs = ko.observableArray();
            ko.computed(function () {
                var query = o.searchQuery();
                if(query.length == 0) {
                    lastPlayedSongs.getAll().done(function (songs) {
                        var songUrls = songs.map(function (song) {
                            return song.url;
                        });
                        if(songUrls.length == 0) {
                            o.filteredSongs(o.filterSongs(query));
                        } else {
                            o.filteredSongs(o.createSongsFromUrls(songUrls));
                        }
                    });
                } else {
                    o.filteredSongs(o.filterSongs(query));
                }
            });
        };
        AppViewModel.prototype.filterSongs = function (query) {
            var o = this;
            var queries = o.splitQuery(query);
            var filteredSongs = o.filterSongsByQueries(queries);
            var slicedSongs = filteredSongs.slice(0, 40);
            var coloredSongs = o.colorSongsByQueries(slicedSongs, queries);
            return coloredSongs;
        };
        AppViewModel.prototype.splitQuery = function (query) {
            var queries = query.toLowerCase().split(" ");
            var trimmedQueries = queries.map(function (query) {
                return query.trim();
            });
            var nonEmptyQueries = trimmedQueries.filter(function (query) {
                return query != "";
            });
            return nonEmptyQueries;
        };
        AppViewModel.prototype.filterSongsByQueries = function (queries) {
            return o.songs.filter(function (song, i) {
                var url = song.url.toLowerCase();
                return queries.every(function (query) {
                    return url.indexOf(query) > -1;
                });
            });
        };
        AppViewModel.prototype.colorSongsByQueries = function (songs, queries) {
            function color(str) {
                queries.forEach(function (query) {
                    str = str.replace(new RegExp(query, 'gi'), '{$&}');
                });
                for(var i = 0; i < queries.length; i++) {
                    str = str.replace(/\{([^{]+?)\}/g, '<span class="search-match">$1</span>');
                }
                return str;
            }
            return songs.map(function (song) {
                if(queries.length > 0 && queries[0].length > 0) {
                    var coloredName = color(song.name);
                    var coloredPath = color(song.path);
                    return {
                        name: coloredName,
                        path: coloredPath,
                        url: song.url
                    };
                } else {
                    return song;
                }
            });
        };
        return AppViewModel;
    })();    
    ko.applyBindings(new AppViewModel());
})
//@ sourceMappingURL=_index.js.map

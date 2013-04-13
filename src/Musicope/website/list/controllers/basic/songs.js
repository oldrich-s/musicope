define(["require", "exports"], function(require, exports) {
    /// <reference path="../../_references.ts" />
    function saveToDB(doc) {
        new Pouch("idb://musicope", function (err, db) {
            db.put(ko.toJS(doc), function (error, response) {
                if(error) {
                    throw "cannot save to DB";
                } else {
                    doc["_rev"] = response["rev"];
                }
            });
        });
    }
    var defaults = [
        {
            prop: "votes",
            value: 0
        }
    ];
    function createIfNotExist(doc, id) {
        if(!doc) {
            var doc2 = {
                _id: id
            };
            defaults.forEach(function (v) {
                doc2[v.prop] = v.value;
            });
            return doc2;
        } else {
            return doc;
        }
    }
    function toKnockout(doc) {
        var koDoc = {
        };
        for(var prop in doc) {
            if(prop !== "_id" && prop !== "_rev") {
                koDoc[prop] = ko.observable(doc[prop]);
                koDoc[prop].subscribe(function (v) {
                    saveToDB(koDoc);
                });
            } else {
                koDoc[prop] = doc[prop];
            }
        }
        return koDoc;
    }
    function getDocsFromDB(ids) {
        var done = $.Deferred();
        new Pouch("idb://musicope", function (err, db) {
            var keys = ids.map(function (id) {
                return btoa(id);
            });
            db.allDocs({
                keys: keys,
                include_docs: true
            }, function (err, response) {
                var koDocs = response.rows.map(function (row, i) {
                    var doc = createIfNotExist(row.doc, keys[i]);
                    return toKnockout(doc);
                });
                done.resolve(koDocs);
            });
        });
        return done.promise();
    }
    function getSongsFromUrls(urls, docs) {
        var songs = urls.map(function (path, i) {
            var vals = path.match(/^(.*\/)([^\/]+)\.([^.]+)$/);
            var song = {
                path: vals[1],
                name: vals[2],
                extension: vals[3],
                url: path,
                db: docs[i]
            };
            return song;
        });
        return songs;
    }
    function getSongListLocal(params) {
        var out = $.Deferred();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', params.readOnly.l_songsUrl);
        xhr.responseType = 'text';
        xhr.onload = function (e) {
            if(this.status == 200) {
                var paths = JSON.parse(this.responseText);
                getDocsFromDB(paths).done(function (docs) {
                    out.resolve(getSongsFromUrls(paths, docs));
                });
            }
        };
        xhr.send();
        return out.promise();
    }
    function getSongListRemote(params) {
        var out = $.Deferred();
        var url = "../proxy.php?url=" + encodeURIComponent(params.readOnly.l_songsUrl);
        $.get(url).done(function (text) {
            var paths = JSON.parse(atob(text));
            getDocsFromDB(paths).done(function (docs) {
                out.resolve(getSongsFromUrls(paths, docs));
            });
        });
        return out;
    }
    function getSongList(params) {
        var out = $.Deferred();
        var isLocal = params.readOnly.l_songsUrl.indexOf("../") == 0;
        if(isLocal) {
            return getSongListLocal(params);
        } else {
            return getSongListRemote(params);
        }
    }
    exports.getSongList = getSongList;
})
//@ sourceMappingURL=songs.js.map

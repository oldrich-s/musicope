/// <reference path="../../_references.ts" />

function saveToDB(doc: any) {
  new Pouch("idb://musicope", (err, db) => {
    db.put(ko.toJS(doc), (error, response) => {
      if (error) {
        throw "cannot save to DB";
      } else {
        doc["_rev"] = response["rev"];
      }
    });
  });
}

var defaults = [{ prop: "votes", value: 0 }];

function createIfNotExist(doc: any, id: string) {
  if (!doc) {
    var doc2 = { _id: id };
    defaults.forEach((v) => {
      doc2[v.prop] = v.value;
    });
    return doc2;
  } else {
    return doc;
  }
}

function toKnockout(doc: any) {
  var koDoc = {};
  for (var prop in doc) {
    if (prop !== "_id" && prop !== "_rev") {
      koDoc[prop] = ko.observable(doc[prop]);
      koDoc[prop].subscribe((v) => {
        saveToDB(koDoc);
      });
    } else {
      koDoc[prop] = doc[prop];
    }
  }
  return koDoc;
}

function getDocsFromDB(ids: string[]) {
  var done = $.Deferred();
  new Pouch("idb://musicope", (err, db) => {
    var keys: string[] = ids.map((id) => {
      return btoa(id);
    });
    db.allDocs({ keys: keys, include_docs: true }, (err, response: ph.AllDocsResponse) => {
      var koDocs = response.rows.map((row, i) => {
        var doc = createIfNotExist(row.doc, keys[i]);
        return toKnockout(doc);
      });
      done.resolve(koDocs);
    });
  });
  return done.promise();
}

function getSongsFromUrls(urls: string[], docs: any[]) {
  var songs: IList.ISong[] = urls.map((path, i) => {
    var vals = path.match(/^(.*\/)([^\/]+)\.([^.]+)$/);
    var song: IList.ISong = {
      path: vals[1],
      name: vals[2],
      extension: vals[3],
      url: path,
      db: docs[i],
    };
    return song;
  });
  return songs;
}

function getSongListLocal(params: IList.IParams) {
  var out = $.Deferred();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', params.readOnly.l_songsUrl);
  xhr.responseType = 'text';
  xhr.onload = function (e) {
    if (this.status == 200) {
      var paths: string[] = JSON.parse(this.responseText);
      getDocsFromDB(paths).done((docs: any[]) => {
        out.resolve(getSongsFromUrls(paths, docs));
      });
    }
  }
  xhr.send();
  return out.promise();
}

function getSongListRemote(params: IList.IParams) {
  var out = $.Deferred();
  var url = "../proxy.php?url=" + encodeURIComponent(params.readOnly.l_songsUrl);
  $.get(url).done((text: string) => {
    var paths: string[] = JSON.parse(atob(text));
    getDocsFromDB(paths).done((docs: any[]) => {
      out.resolve(getSongsFromUrls(paths, docs));
    });
  });
  return out;
}

export function getSongList(params: IList.IParams) {
  var out = $.Deferred();
  var isLocal = params.readOnly.l_songsUrl.indexOf("../") == 0;
  if (isLocal) {
    return getSongListLocal(params);
  } else {
    return getSongListRemote(params);
  }
}
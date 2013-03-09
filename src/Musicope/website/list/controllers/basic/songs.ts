/// <reference path="../../_references.ts" />

function saveToDB(doc: any) {
  new Pouch("idb://musicope", (err, db) => {
    db.put(ko.toJS(doc), (error) => {
      throw "cannot save to DB";
    });
  });
}

function toKnockout(doc: {}) {
  var koDoc = {};
  for (var prop in doc) {
    koDoc[prop] = ko.observable(doc[prop]);
  }
  for (var prop in doc) {
    koDoc[prop].subscribe((v) => {
      saveToDB(koDoc);
    });
  }
  return koDoc;
}

function getDocsFromDB(ids: string[]) {
  var done = $.Deferred();
  new Pouch("idb://musicope", (err, db) => {
    var keys: string[] = ids.map((id) => {
      return encodeURIComponent(song.url);
    });
    db.allDocs({ keys: keys, include_docs: true }, (err, response: ph.AllDocsResponse) => {
      var koDocs = response.rows.map((row) => {
        return row.doc ? toKnockout(row.doc) : undefined;
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
      db: docs[i]
    };
    return song;
  });
  return songs;
}

export function getSongs(params: IList.IParams) {
  var done = $.Deferred();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', params.readOnly.l_songsUrl);
  xhr.responseType = 'text';
  xhr.onload = function (e) {
    if (this.status == 200) {
      var paths: string[] = JSON.parse(this.responseText);
      getDocsFromDB(paths).done((docs: any[]) => {
        done.resolve(getSongsFromUrls(paths, docs));
      });
      
    }
  }
  xhr.send();
  return done.promise();
}
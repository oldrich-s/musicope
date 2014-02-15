module Musicope.List.ControllersFns {

  declare var Firebase;

  function toKnockout(name: string, doc: any, fb: any) {
    var koDoc = {};
    for (var prop in doc) {
      koDoc[prop] = ko.observable(doc[prop]);
      koDoc[prop].subscribe((v) => {
        var js = ko.toJS(koDoc);
        var en = btoa(name);
        fb.child(en).set(js);
      });
    }
    return koDoc;
  }

  function getDocsFromDB(ids: string[], fb: any) {
    var done = $.Deferred();
    fb.once("value", function (data) {
      var v = data.val() || {};
      var res = ids.map((id) => {
        var js = v[btoa(id)] || { votes: 0 };
        return toKnockout(id, js, fb);
      });
      done.resolve((res));
    });
    return done.promise();
  }

  function getSongsFromUrls(urls: string[], docs: any[]) {
    var songs: ISong[] = urls.map((path, i) => {
      var vals = path.match(/^(.*\/)([^\/]+)\.([^.]+)$/);
      var song: ISong = {
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

  function getSongListLocal(params: Params, fb: any) {
    var out = $.Deferred();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', params.readOnly.l_songsUrl);
    xhr.responseType = 'text';
    xhr.onload = function (e) {
      if (this.status == 200) {
        var paths: string[] = JSON.parse(this.responseText);
        getDocsFromDB(paths, fb).done((docs: any[]) => {
          out.resolve(getSongsFromUrls(paths, docs));
        });
      }
    }
    xhr.send();
    return out.promise();
  }

  function getSongListRemote(params: Params, fb: any) {
    var out = $.Deferred();
    var url = "../proxy.php?url=" + encodeURIComponent(params.readOnly.l_songsUrl);
    $.get(url).done((text: string) => {
      var paths: string[] = JSON.parse(atob(text));
      getDocsFromDB(paths, fb).done((docs: any[]) => {
        out.resolve(getSongsFromUrls(paths, docs));
      });
    });
    return out;
  }

  export class Songs {

    fb: any;

    constructor() {
      this.fb = new Firebase("https://musicope.firebaseio.com");
    }

    public getSongList = (params: Params) => {
      var o = this;
      var out = $.Deferred();
      var isLocal = params.readOnly.l_songsUrl.indexOf("../") == 0;
      if (isLocal) {
        return getSongListLocal(params, o.fb);
      } else {
        return getSongListRemote(params, o.fb);
      }
    }

  }

  

}
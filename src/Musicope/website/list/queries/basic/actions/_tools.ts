/// <reference path="../../../_references.ts" />

function colorStringByQueries(str: string, queries: string[]) {
  queries.forEach((query) => {
    str = str.replace(new RegExp(query, 'gi'), '{$&}');
  });
  for (var i = 0; i < queries.length; i++) {
    str = str.replace(/\{([^{]+?)\}/g, '<span class="search-match">$1</span>');
  }
  return str;
}

function colorSongByQueries(song: IList.ISong, queries: string[]) {
  var coloredName = colorStringByQueries(song.name, queries);
  var coloredPath = colorStringByQueries(song.path, queries);
  var coloredSong: IList.ISong = {
    name: coloredName,
    path: coloredPath,
    url: song.url,
    extension: song.extension
  };
  return coloredSong;
}

export function colorSongsByQueries(songs: IList.ISong[], queries: string[]) {
  var coloredSongs: IList.ISong[] = songs.map((song) => {
    if (queries.length > 0 && queries[0].length > 0) {
      return colorSongByQueries(song, queries);
    } else {
      return song;
    }
  });
  return coloredSongs;
}

export function filterSongsByQueries(songs: IList.ISong[], queries: string[]) {
  return songs.filter((song, i) => {
    var url = song.url.toLowerCase();
    return queries.every((query) => {
      return url.indexOf(query) > -1;
    });
  });
}
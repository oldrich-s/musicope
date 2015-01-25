module Musicope.List {

    function filterSongsByQueries(items: any[], queries: string[]) {
        var els = $('.el');
        items.forEach((item, i) => {
            var url = item.path.toLowerCase();
            var found = queries.every((query) => {
                return url.indexOf(query) > -1;
            });
            var display = found ? 'block' : 'none';
            $(els[i]).css('display', display);
        });
    }

    function splitQuery(query: string) {
        var queries = query.toLowerCase().split(" ");
        var trimmedQueries: string[] = queries.map((query) => { return query.trim(); });
        var nonEmptyQueries = trimmedQueries.filter((query) => { return query != ""; });
        return nonEmptyQueries;
    }

    export function filterSongs(query: string, items: any[]) {
        var queries = splitQuery(query);
        filterSongsByQueries(items, queries);
    }

} 
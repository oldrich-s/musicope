module Musicope.List {

    function filterSongsByQueries(queries: string[]) {
        var els = $('.el');
        els.each((i, item) => {
            var url = $(item).find('.elURL').text().trim().toLowerCase();
            var found = queries.every((query) => {
                return url.indexOf(query) > -1;
            });
            var display = found ? 'block' : 'none';
            $(item).css('display', display);
        });
    }

    function splitQuery(query: string) {
        var queries = query.toLowerCase().split(" ");
        var trimmedQueries: string[] = queries.map((query) => { return query.trim(); });
        var nonEmptyQueries = trimmedQueries.filter((query) => { return query != ""; });
        return nonEmptyQueries;
    }

    export function filterSongs(query: string) {
        var queries = splitQuery(query);
        filterSongsByQueries(queries);
    }

} 
module Musicope.List {

    export function startGame(path: string) {
        var options = Options.getOptions();
        location.href = "game";
    }

    function populateDOM(items: any[]) {
        items.forEach((item) => {
            var title = item.name.replace(".mid", "");
            var path = (<string>item.path).replace(item.name, "");
            var template =
                $('.song-list-template')
                    .html().trim()
                    .replace("{{title}}", title)
                    .replace("{{path}}", path)
                    .replace("{{url}}", item.path);
            $(template).appendTo('.midContainer');
        });
    }

    function getAllMidiFiles(client) {
        var files = $.Deferred<any[]>();
        client.search('/', '.mid', {}, function (error, entries: any[]) {
            files.resolve(entries);
        });
        return files;
    }

    $(document).ready(() => {

        var items = [];

        var client = new Dropbox.Client({ key: "ckt9l58i8fpcq6d" });

        client.authenticate(function (error, client) {
            getAllMidiFiles(client).done((_items) => {
                items = _items;
                populateDOM(items);
                Keyboard.bindKeyboard();
            });
        });

        $(document).on('click', '.elLink', function () {
            var path = $(this).siblings('.elURL').text().trim();
            startGame(path);
        });

        var lastQuery = "";

        $('#query')
            .data('timeout', null)
            .keyup(function () {
                clearTimeout($(this).data('timeout'));
                $(this).data('timeout', setTimeout(() => {
                    var query = $(this).val();
                    if (query !== lastQuery) {
                        filterSongs(query, items);
                        Keyboard.resetIndex();
                        lastQuery = query;
                    }
                }, 500));
            });

    });

}
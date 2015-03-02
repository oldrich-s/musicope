module Musicope.List {

    var scores = {};
    var scoresDirty = false;

    function sortList() {
        var els = $('.midContainer .el:visible');
        (<any>els).sort((a, b) => {
            var countA = parseInt($(a).find('.vote-count').text());
            var countB = parseInt($(b).find('.vote-count').text());
            if (countB === countA) {
                var nameA = $(a).find('.elLinkName').text();
                var nameB = $(b).find('.elLinkName').text();
                return nameA > nameB ? 1 : -1;
            } else {
                return countB - countA;
            }
        });
        els.detach().appendTo('.midContainer');
    }
    
    function voteUp(e: JQueryEventObject) {
        var id = $(this).parents('.el').children('.elURL').text().trim();
        var old = parseInt(scores[id] || '0');
        scores[id] = old + 1;
        scoresDirty = true;
        $(this).siblings('.vote-count').text(old + 1);
        e.preventDefault();
    }

    function voteDown(e: JQueryEventObject) {
        var id = $(this).parents('.el').children('.elURL').text().trim();
        var old = parseInt(scores[id] || '0');
        scores[id] = old - 1;
        scoresDirty = true;
        $(this).siblings('.vote-count').text(old - 1);
        e.preventDefault();
    }

    function populateDOM(items: any[], scores: any) {
        items.forEach((item) => {
            var title = item.name.replace(".mid", "");
            var path = (<string>item.path).replace(item.name, "");
            var score = scores[item.path] || "0";
            var template =
                $('.song-list-template')
                    .html().trim()
                    .replace("{{title}}", title)
                    .replace("{{path}}", path)
                    .replace("{{score}}", score)
                    .replace("{{url}}", item.path);
            $(template).appendTo('.midContainer');
        });
        sortList();
    }

    function startSavingScores() {
        setInterval(() => {
            if (scoresDirty) {
                var text = JSON.stringify(scores, null, 4);
                scoresDirty = false;
                dropbox.writeFile('settings.json', text);
            }
        }, 1000);
    }

    function initScores() {
        var def = $.Deferred<void>();
        dropbox.readFile('settings.json', function (error, data) {
            if (!data) {
                def.resolve();
            } else {
                scores = JSON.parse(data);
                def.resolve();
            }
            startSavingScores();
        });
        return def;
    }

    function getAllMidiFiles(client) {
        var files = $.Deferred<any[]>();
        client.search('songs', '.mid', {}, function (error, entries: any[]) {
            files.resolve(entries);
        });
        return files;
    }

    export function init() {

        dropbox.authenticate(function (error, client) {
            initScores().done(() => {
                getAllMidiFiles(client).done((items) => {
                    populateDOM(items, scores);
                    $('.el:visible:first').addClass('elFocus');
                    Keyboard.bindKeyboard();
                });
            });
        });

        $(document).on('click', '.vote-up', voteUp);
        $(document).on('click', '.vote-down', voteDown);

        $(document).on('click', '.elLink', function () {
            var el = $(this).siblings('.elURL');
            if (el.length > 1) {
                throw "wtf";
            }
            params.c_songUrl = $(el[0]).text().trim();
            Mousetrap.reset();
            game = new Musicope.Game.Game();
        });

        var lastQuery = "";

        $('#query')
            .data('timeout', null)
            .keyup(function () {
                clearTimeout($(this).data('timeout'));
                $(this).data('timeout', setTimeout(() => {
                    var query = $(this).val();
                    if (query !== lastQuery) {
                        filterSongs(query);
                        sortList();
                        Keyboard.resetIndex();
                        lastQuery = query;
                    }
                }, 500));
            });

    }

}
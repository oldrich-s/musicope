module Musicope.List {
    
    var scores = {};
    var scoresDirty = false;

    function sortList() {
        var els = $('.song-list li:visible');
        (<any>els).sort((a, b) => {
            var countA = parseInt($(a).find('.vote-count').text());
            var countB = parseInt($(b).find('.vote-count').text());
            if (countB === countA) {
                var nameA = $(a).find('.item-title').text();
                var nameB = $(b).find('.item-title').text();
                return nameA > nameB ? 1 : -1;
            } else {
                return countB - countA;
            }
        });
        els.detach().appendTo('.song-list');
    }
    
    function voteUp(e: JQueryEventObject) {
        var id = decodeURIComponent($(this).parents('li').children('.elURL').text().trim());
        var old = parseInt(scores[id] || '0');
        scores[id] = old + 1;
        scoresDirty = true;
        $(this).siblings('.vote-count').text(old + 1);
        e.stopPropagation();
        e.preventDefault();
    }

    function voteDown(e: JQueryEventObject) {
        var id = decodeURIComponent($(this).parents('li').children('.elURL').text().trim());
        var old = parseInt(scores[id] || '0');
        scores[id] = old - 1;
        scoresDirty = true;
        $(this).siblings('.vote-count').text(old - 1);
        e.stopPropagation();
        e.preventDefault();
    }

    function populateDOM(files: string[], scores: any) {
        files.forEach((file) => {
            var score = scores[file] || "0";
            var m = file.match(/^songs\\(.*?)([^\\]+)$/);
            var path = m[1];
            var title = m[2].replace(/_/g, " ");
            var template =
                $('.song-list-template')
                    .html().trim()
                    .replace("{{title}}", title)
                    .replace("{{titleEnc}}", encodeURIComponent(title))
                    .replace("{{path}}", path)
                    .replace("{{score}}", score)
                    .replace(/{{urlEnc}}/g, encodeURIComponent(file))
                    .replace(/{{url}}/g, file);
            $(template).appendTo('.song-list');
        });
        sortList();
    }

    function startSavingScores() {
        setInterval(() => {
            if (scoresDirty) {
                var text = JSON.stringify(scores, null, 4);
                scoresDirty = false;
                io.writeFile(songsJsonPath, text);
            }
        }, 1000);
    }

    function initScores() {
        var fileExists = io.existsFile(songsJsonPath);
        if (fileExists) {
            var text = io.readFile(songsJsonPath);
            eval("scores = " + text);
        }
        startSavingScores();
    }

    export function init() {
        initScores();
        var files: string[] = JSON.parse(io.getAllFiles("songs"));
        populateDOM(files, scores);
        $('.song-list li:visible:first').addClass('song-list-el-focus');
        $('.vote-up').on('click', voteUp);
        $('.vote-down').on('click', voteDown);
        Keyboard.bindKeyboard();
    }

}
import { existsFile, readTextFile, writeTextFile, getAllFiles, songsJsonPath, ensureDirectoryExistence } from "../io/io";
import { bindKeyboard } from "./keyboard";

var scores = {};
var scoresDirty = false;

function sortList() {
    var els = $('.song-list li:visible');
    (<any>els).sort((a, b) => {
        var countA = parseInt($(a).find('.vote-count').text());
        var countB = parseInt($(b).find('.vote-count').text());
        if (countB === countA) {
            var timeA = parseInt($(a).find('.item-time').text());
            var timeB = parseInt($(b).find('.item-time').text());
            return timeB > timeA ? 1 : -1;
            //var nameA = $(a).find('.item-title').text();
            //var nameB = $(b).find('.item-title').text();
            //return nameA > nameB ? 1 : -1;
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

function populateDOM(files: { path: string; time: Date; }[], scores: any) {
    files.forEach((file) => {
        var score = scores[file.path] || "0";
        var m = file.path.match(/^songs\\(.*?)([^\\]+)$/);
        var path = m[1];
        var title = m[2].replace(/_/g, " ");
        var template =
            $('.song-list-template')
                .html().trim()
                .replace("{{title}}", title)
                .replace("{{titleEnc}}", encodeURIComponent(title))
                .replace("{{path}}", path)
                .replace("{{score}}", score)
                .replace("{{time}}", '' + file.time.getTime())
                .replace(/{{urlEnc}}/g, encodeURIComponent(file.path))
                .replace(/{{url}}/g, file.path);
        $(template).appendTo('.song-list');
    });
    sortList();
}

function startSavingScores() {
    setInterval(() => {
        if (scoresDirty) {
            var text = JSON.stringify(scores, null, 4);
            scoresDirty = false;
            writeTextFile(songsJsonPath, text);
        }
    }, 1000);
}

function initScores() {
    if (!existsFile(songsJsonPath)) {
        writeTextFile(songsJsonPath, "{}");
    }
    var text = readTextFile(songsJsonPath);
    eval("scores = " + text);
    startSavingScores();
}

export function init() {
    initScores();
    ensureDirectoryExistence("songs");
    var files = getAllFiles("songs");
    populateDOM(files, scores);
    $('.song-list li:visible:first').addClass('song-list-el-focus');
    $('.vote-up').on('click', voteUp);
    $('.vote-down').on('click', voteDown);
    bindKeyboard();
}


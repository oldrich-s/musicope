function enter() {
    Mousetrap.bind('enter', (e) => {
        var href = $('.song-list-el-focus a').attr('href');
        mainView.router.loadPage(href);
        e.preventDefault();
    });
}

function up() {
    Mousetrap.bind('up', (e) => {
        var oldEl = $('.song-list-el-focus');
        var newEl = oldEl.prevAll(':visible').first();
        if (newEl.length > 0) {
            oldEl.removeClass('song-list-el-focus');
            newEl.addClass('song-list-el-focus');
            correctPosition();
        }
        e.preventDefault();
    });
}

function down() {
    Mousetrap.bind('down', (e) => {
        var oldEl = $('.song-list-el-focus');
        var newEl = oldEl.nextAll(':visible').first();
        if (newEl.length > 0) {
            oldEl.removeClass('song-list-el-focus');
            newEl.addClass('song-list-el-focus');
            correctPosition();
        }
        e.preventDefault();
    });
}

function home() {
    Mousetrap.bind('home', (e) => {
        var list = $('.song-list');
        var newEl = list.find('li:visible').first();
        if (newEl.length > 0) {
            list.find('.song-list-el-focus').removeClass('song-list-el-focus');
            newEl.addClass('song-list-el-focus');
            correctPosition();
        }
        e.preventDefault();
    });
}

function end() {
    Mousetrap.bind('end', (e) => {
        var list = $('.song-list');
        var newEl = list.find('li:visible').last();
        if (newEl.length > 0) {
            list.find('.song-list-el-focus').removeClass('song-list-el-focus');
            newEl.addClass('song-list-el-focus');
            correctPosition();
        }
        e.preventDefault();
    });
}

function pageDown() {
    Mousetrap.bind('pagedown', (e) => {
        var oldEl = $('.song-list-el-focus');
        var newEls = oldEl.nextAll(':visible');
        var newEl =
            newEls.length == 0 ? oldEl :
                (newEls.length < 5 ? newEls.last() : $(newEls[4]));
        oldEl.removeClass('song-list-el-focus');
        newEl.addClass('song-list-el-focus');
        correctPosition();
        e.preventDefault();
    });
}

function pageUp() {
    Mousetrap.bind('pageup', (e) => {
        var oldEl = $('.song-list-el-focus');
        var newEls = oldEl.prevAll(':visible');
        var newEl =
            newEls.length == 0 ? oldEl :
                (newEls.length < 5 ? newEls.last() : $(newEls[4]));
        oldEl.removeClass('song-list-el-focus');
        newEl.addClass('song-list-el-focus');
        correctPosition();
        e.preventDefault();
    });
}

export function bindKeyboard() {
    down();
    up();
    home();
    end();
    pageDown();
    pageUp();
    enter();
}

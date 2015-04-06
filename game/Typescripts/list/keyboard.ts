module Musicope.List.Keyboard {

    function correctPosition() {
        var ul = $('.list-scroll');
        var li = $(".song-list-el-focus");
        var rely: number = li.position().top - ul.scrollTop() + 35;
        var drely1 = rely + 1.5 * li.height() - ul.height();
        var drely2 = rely - 0.5 * li.height();
        if (drely1 > 0) {
            ul.scrollTop(ul.scrollTop() + drely1);
        } else if (drely2 < 0) {
            ul.scrollTop(ul.scrollTop() + drely2);
        }
        return true;
    }

    function enter() {
        Mousetrap.bind('enter',(e) => {
            var href = $('.song-list-el-focus a').attr('href');
            mainView.router.loadPage(href);
            e.preventDefault();
        });
    }

    function up() {
        Mousetrap.bind('up',(e) => {
            var oldEl = $('.song-list-el-focus');
            var newEl = oldEl.prev(':visible');
            if (newEl.length > 0) {
                oldEl.removeClass('song-list-el-focus');
                newEl.addClass('song-list-el-focus');
                correctPosition();
            }
            e.preventDefault();
        });
    }

    function down() {
        Mousetrap.bind('down',(e) => {
            var oldEl = $('.song-list-el-focus');
            var newEl = oldEl.next(':visible');
            if (newEl.length > 0) {
                oldEl.removeClass('song-list-el-focus');
                newEl.addClass('song-list-el-focus');
                correctPosition();
            }
            e.preventDefault();
        });
    }

    function pageDown() {
        Mousetrap.bind('pagedown',(e) => {
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
        Mousetrap.bind('pageup',(e) => {
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

    //export function resetIndex() {
    //    $('.elFocus').removeClass('elFocus');
    //    $('.el:visible:first').addClass('elFocus');
    //    $(window).scrollTop(0);
    //}

    export function bindKeyboard() {
        down();
        up();
        pageDown();
        pageUp();
        enter();
    }
} 
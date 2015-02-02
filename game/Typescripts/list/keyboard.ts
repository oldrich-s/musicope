module Musicope.List.Keyboard {

    function correctPosition() {
        var el = $(".elFocus");
        var rely: number = el.offset()["top"] - $(window).scrollTop() + 0.5 * el.height();
        if (rely > 0.9 * window.innerHeight) {
            var dy = window.innerHeight - 1.5 * el.height() - rely;
            $(window).scrollTop($(window).scrollTop() - dy);
        } else if (rely < 0.2 * window.innerHeight) {
            $(window).scrollTop(el.offset()["top"] - 2 * el.height());
        }
        return true;
    }

    function enter() {
        Mousetrap.bind('enter',(e) => {
            params.c_songUrl = $('.el').filter('.elFocus').find('.elURL').text().trim();
            var c = new Musicope.Game.Controller();
            e.preventDefault();
        });
    }

    function up() {
        Mousetrap.bind('up',(e) => {
            var oldEl = $('.el').filter('.elFocus');
            var newEl = oldEl.prev(':visible');
            if (newEl.length > 0) {
                oldEl.removeClass('elFocus');
                newEl.addClass('elFocus');
                correctPosition();
            }
            e.preventDefault();
        });
    }

    function down() {
        Mousetrap.bind('down',(e) => {
            var oldEl = $('.el').filter('.elFocus');
            var newEl = oldEl.next(':visible');
            if (newEl.length > 0) {
                oldEl.removeClass('elFocus');
                newEl.addClass('elFocus');
                correctPosition();
            }
            e.preventDefault();
        });
    }

    export function resetIndex() {
        $('.elFocus').removeClass('elFocus');
        $('.el:visible:first').addClass('elFocus');
        $(window).scrollTop(0);
    }

    export function bindKeyboard() {
        $('.el:visible:first').addClass('elFocus');
        down();
        up();
        enter();
    }
} 
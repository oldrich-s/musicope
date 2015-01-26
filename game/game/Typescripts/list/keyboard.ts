module Musicope.List.Keyboard {

    var index = 0;

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

    function enter(els: JQuery) {
        Mousetrap.bind('enter',(e) => {
            params.c_songUrl = $(els[index]).find('.elURL').text().trim();
            var c = new Musicope.Game.Controller();
            e.preventDefault();
        });
    }

    function up(els: JQuery) {
        Mousetrap.bind('up',(e) => {
            for (var i = index - 1; i >= 0; i--) {
                if (els[i].style.display !== 'none') {
                    els.removeClass('elFocus');
                    $(els[i]).addClass('elFocus');
                    index = i;
                    break;
                }
            }
            correctPosition();
            e.preventDefault();
        });
    }

    function down(els: JQuery) {
        Mousetrap.bind('down',(e) => {
            for (var i = index + 1; i < els.length; i++) {
                if (els[i].style.display !== 'none') {
                    els.removeClass('elFocus');
                    $(els[i]).addClass('elFocus');
                    index = i;
                    break;
                }
            }
            correctPosition();
            e.preventDefault();
        });
    }

    export function resetIndex() {
        var els = $('.el');
        index = $('.el:visible:first').index();
        els.removeClass('elFocus');
        $(els[index]).addClass('elFocus');
        $(window).scrollTop(0);
    }

    export function bindKeyboard() {
        var els = $('.el');
        $('.el').first().addClass('elFocus');
        down(els);
        up(els);
        enter(els);
    }
} 
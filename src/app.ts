import * as $ from 'jquery'
import * as Framework7 from 'framework7'

import { Game } from "./game/game";
import { defaultConfig } from "./config/default-config";
import { reset, config, set as setConfig } from "./config/config";
import { bindKeyboard } from "./list-of-songs/keyboard";
import { actions } from "./game/keyboard/actions";
import { init as setupInit } from "./list-of-songs/setup";
import { init as listInit } from "./list-of-songs/list-of-songs";

export var game: Game;
export var app: Framework7;
export var mainView;

export function correctPosition() {
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

function tryRoundValue(value: any): string {
    if (typeof value == "number") {
        return "" + (Math.round(100 * value) / 100);
    } else if (value === undefined || value === null) {
        return "-";
    } else {
        return "" + value;
    }
}

$(document).ready(() => {

    app = new Framework7({
        swipeBackPage: false
    });

    mainView = app.addView('.view-main', {
        domCache: true
    });

    var mySearchbar = app.searchbar('.searchbar', {
        searchList: '.list-block-search',
        searchIn: '.item-title, .item-text'
    });

    $('.list-block-search').on('search', (a, b, c) => {
        $('.song-list-el-focus').removeClass('song-list-el-focus');
        $('.list-scroll li:visible:first').addClass('song-list-el-focus');
        $('.list-scroll').scrollTop(0);
    });


    app.onPageBeforeAnimation('play', (page) => {
        if ('url' in page.query) {
            $('.searchbar-input input').blur();
            Mousetrap.reset();
            setConfig(jQuery.extend(true, {}, defaultConfig));
            config.c_songUrl = decodeURIComponent(page.query.url);
            game = new Game();
            var path = decodeURIComponent(page.query.url).replace(/songs\\(.+)\\[^\\]+$/, '$1');
            $('.playTitle').text(decodeURIComponent(page.query.title));
            $('.playPath').text(path);
            app.sizeNavbars();
        }
    });

    app.onPageAfterAnimation('index', (page) => {
        $('.searchbar-input input').focus();
        Mousetrap.reset();
        reset();
        bindKeyboard();
        correctPosition();
    });

    app.onPageBeforeAnimation('help', (page) => {
        config.p_isPaused = true;
        var root = $('.help-page-main');
        root.find("tr:has(td)").html("");
        var tmpl = $(".help-page-el").text();
        for (var key in actions) {
            var v = actions[key];
            var text = tmpl
                .replace("{{title}}", v.title)
                .replace("{{key}}", key)
                .replace("{{desc}}", v.description)
                .replace("{{value}}", tryRoundValue(v.getCurrentState()));
            root.append(text);
        }
    });

    listInit();
    setupInit();
});
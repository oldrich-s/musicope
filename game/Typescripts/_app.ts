declare var require;

var fs = require("fs");
var p = require('path');
var gui = require('nw.gui');

module Musicope {

    export var game: Game.Game;
    export var app: Framework7;
    export var mainView;
    export var webMidi: WebMidi;

    export var songsJsonPath = "songs.json";
    export var setupJsonPath = "setup.json";

    var win = gui.Window.get();
    //win.maximize();

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

        $('.list-block-search').on('search',(a,b,c) => {
            $('.song-list-el-focus').removeClass('song-list-el-focus');
            $('.list-scroll li:visible:first').addClass('song-list-el-focus');
            $('.list-scroll').scrollTop(0);
        });


        app.onPageBeforeAnimation('play',(page) => {
            if ('url' in page.query) {
                Mousetrap.reset();
                config = jQuery.extend(true, {}, defaultConfig);
                config.c_songUrl = decodeURIComponent(page.query.url);
                game = new Musicope.Game.Game();
                $('.playTitle').text(decodeURIComponent(page.query.title));
                app.sizeNavbars();
            }
        });

        app.onPageAfterAnimation('index',(page) => {
            Mousetrap.reset();
            Params.reset();
            List.Keyboard.bindKeyboard();
        });

        app.onPageAfterAnimation('help',(page) => {
            config.p_isPaused = true;
        });

        List.init();
        Setup.init();

        webMidi = new WebMidi();
    });
} 
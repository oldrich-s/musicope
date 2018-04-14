import * as $ from 'jquery'
import * as Framework7 from 'framework7'
import * as Mousetrap from 'mousetrap'

import { defaultConfig } from "../config/default-config"
import { reset, config, setParam as setConfig } from "../config/config"
import { bindKeyboard } from "./keyboard"
import { init as listInit } from "./list-of-songs"

export var app: Framework7
export var mainView: Framework7.View

export function correctPosition() {
    var ul = $('.list-scroll')
    var li = $(".song-list-el-focus")
    const liheight = li.height() as number
    const ulscrolltop = ul.scrollTop() as number
    var rely: number = li.position().top - ulscrolltop + 35
    var drely1 = rely + 1.5 * liheight - (ul.height() as number)
    var drely2 = rely - 0.5 * liheight
    if (drely1 > 0) {
        ul.scrollTop(ulscrolltop + drely1)
    } else if (drely2 < 0) {
        ul.scrollTop(ulscrolltop + drely2)
    }
    return true
}

function tryRoundValue(value: any): string {
    if (typeof value == "number") {
        return "" + (Math.round(100 * value) / 100)
    } else if (value === undefined || value === null) {
        return "-"
    } else {
        return "" + value
    }
}

export function init() {

    app = new Framework7({
        swipeBackPage: false
    })

    mainView = app.addView('.view-main', {
        domCache: true
    })

    var mySearchbar = app.searchbar('.searchbar', {
        searchList: '.list-block-search',
        searchIn: '.item-title, .item-text'
    })

    $('.list-block-search').on('search', (a, b, c) => {
        if (mySearchbar.query) {
            $('.song-list-el-focus').removeClass('song-list-el-focus')
            $('.list-scroll li:visible:first').addClass('song-list-el-focus')
            $('.list-scroll').scrollTop(0)
        }
    })

    app.onPageAfterAnimation('index', (page) => {
        $('.searchbar-input input').focus()
        Mousetrap.reset()
        reset()
        bindKeyboard()
        correctPosition()
    })

    listInit()
    setupInit()
}
import * as Mousetrap from 'mousetrap'

import { mainView, correctPosition } from "./app"

function enter() {
    Mousetrap.bind('enter', (e) => {
        const href = $('.song-list-el-focus a').attr('href') as string
        const win = window.open(href, '_blank')
        win.focus()
        e.preventDefault()
    })
}

function up() {
    Mousetrap.bind('up', (e) => {
        const oldEl = $('.song-list-el-focus')
        const newEl = oldEl.prevAll(':visible').first()
        if (newEl.length > 0) {
            oldEl.removeClass('song-list-el-focus')
            newEl.addClass('song-list-el-focus')
            correctPosition()
        }
        e.preventDefault()
    })
}

function down() {
    Mousetrap.bind('down', (e) => {
        const oldEl = $('.song-list-el-focus')
        const newEl = oldEl.nextAll(':visible').first()
        if (newEl.length > 0) {
            oldEl.removeClass('song-list-el-focus')
            newEl.addClass('song-list-el-focus')
            correctPosition()
        }
        e.preventDefault()
    })
}

function home() {
    Mousetrap.bind('home', (e) => {
        const list = $('.song-list')
        const newEl = list.find('li:visible').first()
        if (newEl.length > 0) {
            list.find('.song-list-el-focus').removeClass('song-list-el-focus')
            newEl.addClass('song-list-el-focus')
            correctPosition()
        }
        e.preventDefault()
    })
}

function end() {
    Mousetrap.bind('end', (e) => {
        const list = $('.song-list')
        const newEl = list.find('li:visible').last()
        if (newEl.length > 0) {
            list.find('.song-list-el-focus').removeClass('song-list-el-focus')
            newEl.addClass('song-list-el-focus')
            correctPosition()
        }
        e.preventDefault()
    })
}

function pageDown() {
    Mousetrap.bind('pagedown', (e) => {
        const oldEl = $('.song-list-el-focus')
        const newEls = oldEl.nextAll(':visible')
        const newEl =
            newEls.length == 0 ? oldEl :
                (newEls.length < 5 ? newEls.last() : $(newEls[4]))
        oldEl.removeClass('song-list-el-focus')
        newEl.addClass('song-list-el-focus')
        correctPosition()
        e.preventDefault()
    })
}

function pageUp() {
    Mousetrap.bind('pageup', (e) => {
        const oldEl = $('.song-list-el-focus')
        const newEls = oldEl.prevAll(':visible')
        const newEl =
            newEls.length == 0 ? oldEl :
                (newEls.length < 5 ? newEls.last() : $(newEls[4]))
        oldEl.removeClass('song-list-el-focus')
        newEl.addClass('song-list-el-focus')
        correctPosition()
        e.preventDefault()
    })
}

export function bindKeyboard() {
    down()
    up()
    home()
    end()
    pageDown()
    pageUp()
    enter()
}

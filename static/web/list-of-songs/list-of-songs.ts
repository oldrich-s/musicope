import * as $ from 'jquery'

import * as dom from '../soil'
import { readTextFile, writeTextFile, listAllSongs } from "../io/io"
import { bindKeyboard } from "./keyboard"

let scores: { [key: string]: number } = {}
let scoresDirty = false

function sortList() {
    const els = $('.song-list li:visible') as any
    els.sort((a: any, b: any) => {
        const countA = parseInt($(a).find('.vote-count').text())
        const countB = parseInt($(b).find('.vote-count').text())
        if (countB === countA) {
            const timeA = parseInt($(a).find('.item-time').text())
            const timeB = parseInt($(b).find('.item-time').text())
            return timeB > timeA ? 1 : -1
        } else {
            return countB - countA
        }
    })
    els.detach().appendTo('.song-list')
}

function voteUp(this: any, e: any) {
    const id = decodeURIComponent($(this).parents('li').children('.elURL').text().trim())
    const old = scores[id] || 0
    scores[id] = old + 1
    scoresDirty = true
    $(this).siblings('.vote-count').text(old + 1)
    e.stopPropagation()
    e.preventDefault()
}

function voteDown(this: any, e: any) {
    const id = decodeURIComponent($(this).parents('li').children('.elURL').text().trim())
    const old = scores[id] || 0
    scores[id] = old - 1
    scoresDirty = true
    $(this).siblings('.vote-count').text(old - 1)
    e.stopPropagation()
    e.preventDefault()
}

function populateDOM(files: { path: string, mtime: string }[]) {
    files.forEach((file) => {
        const score = scores[file.path] || 0
        const m = file.path.match(/\/songs\/(.*?)([^\/]+)$/)
        if (m) {
            const path = m[1]
            const title = m[2].replace(/_/g, " ")
            const li = dom.li({}, [
                dom.a({ href: `../game/?url=${encodeURIComponent(file.path)}&title=${encodeURIComponent(title)}`, className: 'external item-link item-content', target: '_blank' }, [
                    dom.div({ className: 'item-media' }, [
                        dom.div({ className: 'vote' }, [
                            dom.div({ className: 'vote-up', onclick: voteUp }),
                            dom.div({ className: 'vote-count' }, '' + score),
                            dom.div({ className: 'vote-down', onclick: voteDown })
                        ])
                    ]),
                    dom.div({ className: 'item-inner' }, [
                        dom.div({ className: 'item-title-row', style: { padding: '0 20px 0 20px' } }, [
                            dom.div({ className: 'item-title', style: { width: '100%', whiteSpace: 'normal', wordWrap: 'break-word', fontSize: '20px', color: '#ffec82' } }, title)
                        ]),
                        dom.div({ className: 'item-text' }, path),
                        dom.div({ className: 'item-time', style: { display: 'none' } }, '' + new Date(file.mtime).getTime())
                    ])
                ]),
                dom.div({ className: 'elURL', style: { display: 'none' } }, file.path)
            ])
            $('.song-list').append(li)
        }
    })
    sortList()
}

function startSavingScores() {
    setInterval(() => {
        if (scoresDirty) {
            const text = JSON.stringify(scores, null, 4)
            scoresDirty = false
            writeTextFile('/scores.json', text)
        }
    }, 1000)
}

async function initScores() {
    const sc = await readTextFile('/scores.json')
    scores = (sc && JSON.parse(sc)) || {}
    startSavingScores()
}

export async function init() {
    await initScores()
    const files = await listAllSongs()
    populateDOM(files)
    $('.song-list li:visible:first').addClass('song-list-el-focus')
    bindKeyboard()
}


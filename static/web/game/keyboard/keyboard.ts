import * as Mousetrap from 'mousetrap'

import { Song } from "../song/song"
import { actions } from "./actions"
import { display } from "./keyboard-overlay"

export class Keyboard {

    constructor(private song: Song) {
        const o = this
        o.subscribeActions()
        $('.canvasInfo').hide()
    }

    private subscribeActions() {
        const o = this
        for (const key in actions) {
            Mousetrap.bind(key, function (action: any) {
                action.triggerAction(o.song)
                display(action.title, action.getCurrentState())
            }.bind(this, actions[key]))
        }
    }

}


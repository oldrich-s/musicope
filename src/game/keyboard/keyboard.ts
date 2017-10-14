import * as $ from 'jquery'

import { Song } from "../song/song";
import { actions } from "./actions";
import { display } from "./keyboard-overlay";

export class Keyboard {

    constructor(private song: Song) {
        var o = this;
        o.subscribeActions();
        $('.canvasInfo').hide();
    }

    private subscribeActions() {
        var o = this;
        for (var key in actions) {
            Mousetrap.bind(key, function (action) {
                action.triggerAction(o.song);
                display(action.title, action.getCurrentState());
            }.bind(this, actions[key]));
        }
    }

}


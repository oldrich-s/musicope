import * as $ from 'jquery'

import { config } from "../config/config"
import { webMidi } from "../web-midi/web-midi"
import { readBinaryFileAsString } from "../io/io"

import { Keyboard } from "./keyboard/keyboard"
import { Metronome } from "./metronome/metronome"
import { Song } from "./song/song"
import { Player } from "./player/player"
import { Scene } from "./scene/scene"

export class Game {

    private keyboard: Keyboard
    private metronome: Metronome
    private song: Song
    private player: Player
    private scene: Scene

    constructor() {
        const o = this
        if (!config.c_songUrl) { throw "c_songUrl does not exist!" }
        else {
            webMidi.ready.then(async () => {
                const text = await readBinaryFileAsString(config.c_songUrl as string)
                if (text.length == 0) {
                    throw "error loading midi file"
                } else {
                    o.init(text)
                }
            })
        }
    }

    private init(data: string): void {
        const o = this
        o.song = new Song(data)
        o.scene = new Scene(o.song)
        o.metronome = new Metronome(o.song.midi.signatures)
        o.player = new Player(o.song, o.metronome, o.scene)
        o.keyboard = new Keyboard(o.song)
        o.step()
    }

    private step() {
        const o = this
        function _step() {
            o.requestAnimationFrame.call(window, _step)
            o.player.step()
        }
        _step()
    }

    private requestAnimationFrame: (fn: () => void) => void =
    window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] ||
    function (callback) { window.setTimeout(callback, 1000 / 60) }

}
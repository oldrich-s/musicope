import { webMidi } from "../../web-midi/web-midi"
import { config, setParam, subscribe } from "../../config/config"

import { Scene } from "../scene/scene"
import { INote } from "../midi-parser/i-midi-parser"
import { Song } from "../song/song"
import { Metronome } from "../metronome/metronome"

import { FromDevice } from "./from-device"
import { PlayNotes } from "./play-notes"
import { PlaySustains } from "./play-sustains"
import { WaitForNote } from "./wait-for-note"

function driverOnNotesToOff() {
    for (let i = 0; i < 128; i++) {
        webMidi.out(144, i, 0)
    }
}

function getIdBelowCurrentTime(notes: INote[]) {
    if (notes.length > 0) {
        let id = notes.length - 1
        while (id >= 0 && notes[id] && notes[id].time > (config.p_elapsedTime || 0)) {
            id--
        }
        return id
    }
}

function getIdsBelowCurrentTime(playerTracks: INote[][]) {
    return playerTracks.map(v => getIdBelowCurrentTime(v))
}

function correctTimesInParams(timePerBar: number) {
    if (typeof config.p_initTime == 'undefined') {
        setParam("p_initTime", -2 * timePerBar)
    }
    if (typeof config.p_elapsedTime == 'undefined') {
        setParam("p_elapsedTime", config.p_initTime)
    }
}

export class Player {

    private previousTime: number
    private playNotes: PlayNotes
    private playSustains: PlaySustains
    private waitForNote: WaitForNote
    private fromDevice: FromDevice

    constructor(private song: Song, private metronome: Metronome, private scene: Scene) {
        const o = this
        correctTimesInParams(o.song.midi.signatures[0].msecsPerBar)
        o.subscribeToParamsChange()
        o.assignClasses()
    }

    step = () => {
        const o = this
        o.playNotes.play()
        o.playSustains.play()
        o.metronome.play(config.p_elapsedTime || 0)
        o.scene.redraw(config.p_elapsedTime || 0, config.p_isPaused)
        const isFreeze = o.waitForNote.isFreeze()
        return o.updateTime(isFreeze)
    }

    private subscribeToParamsChange = () => {
        const o = this
        subscribe("players.Basic", "^p_elapsedTime$", (name, value) => {
            o.reset()
        })
    }

    private reset = () => {
        const o = this
        o.scene.reset()
        o.metronome.reset()
        const idsBelowCurrentTime = getIdsBelowCurrentTime(o.song.midi.tracks)
        o.waitForNote.reset(idsBelowCurrentTime as any)
        o.playNotes.reset(idsBelowCurrentTime as any)
        driverOnNotesToOff()
    }

    private assignClasses = () => {
        const o = this
        o.fromDevice = new FromDevice(o.scene, o.song.midi.tracks)
        o.playNotes = new PlayNotes(o.scene, o.song.midi.tracks)
        o.playSustains = new PlaySustains(o.song.midi.sustainNotes)
        o.waitForNote = new WaitForNote(o.scene, o.song.midi.tracks, o.fromDevice.onNoteOn)
    }

    private updateTime = (isFreeze: boolean) => {
        const o = this
        const currentTime = Date.now()
        if (!o.previousTime) { o.previousTime = currentTime }
        const duration = currentTime - o.previousTime
        o.previousTime = currentTime

        const isSongEnd = (config.p_elapsedTime || 0) > o.song.timePerSong + 1000

        const doFreezeTime =
            isSongEnd ||
            config.p_isPaused ||
            isFreeze || /*waiting for hands*/
            duration > 100 /*window was out of focus*/

        if (!doFreezeTime) {
            let newElapsedTime = (config.p_elapsedTime || 0) + config.p_speed * duration
            if (config.p_loopEnd && newElapsedTime > config.p_loopEnd) {
                newElapsedTime = config.p_loopStart || 0
                setParam("p_elapsedTime", newElapsedTime)
            } else {
                setParam("p_elapsedTime", newElapsedTime, true)
            }
        }

        return isSongEnd
    }   

}
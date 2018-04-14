import { config } from "../../config/config"
import { webMidi } from "../../web-midi/web-midi"

import { Scene } from "../scene/scene"
import { INote } from "../midi-parser/i-midi-parser"

export class PlayNotes {

    private ids: number[]

    constructor(private scene: Scene, private notes: INote[][]) {
        const o = this
        o.assignIds()
    }

    play = () => {
        const o = this
        for (let trackId = 0; trackId < o.notes.length; trackId++) {
            while (o.isIdBelowCurrentTime(trackId)) {
                const note = o.notes[trackId][o.ids[trackId]]
                if (!o.isIdWayTooBelowCurrentTime(trackId)) {
                    o.playNote(note, trackId)
                }
                o.ids[trackId]++
            }
        }
    }

    reset = (idsBelowCurrentTime: number[]) => {
        const o = this
        for (let i = 0; i < idsBelowCurrentTime.length; i++) {
            o.ids[i] = Math.max(0, idsBelowCurrentTime[i])
        }
    }

    private assignIds = () => {
        const o = this
        o.ids = o.notes.map(() => { return 0 })
    }

    private isIdBelowCurrentTime = (trackId: number) => {
        const o = this
        return o.notes[trackId][o.ids[trackId]] &&
            o.notes[trackId][o.ids[trackId]].time < (config.p_elapsedTime || 0)
    }

    private isIdWayTooBelowCurrentTime = (trackId: number) => {
        const o = this
        return o.notes[trackId][o.ids[trackId]] &&
            o.notes[trackId][o.ids[trackId]].time < (config.p_elapsedTime || 0) - 100
    }

    private playNote = (note: INote, trackId: number) => {
        const o = this
        if (!config.p_userHands[trackId] || o.playOutOfReach(note)) {
            if (note.on) {
                webMidi.out(144, note.id, Math.min(127, o.getVelocity(trackId, note)))
                o.scene.setPianoActiveId(note.id)
            } else {
                webMidi.out(144, note.id, 0)
                o.scene.unsetPianoActiveId(note.id)
            }
        } else if (config.p_playAllHands) {
            if (note.on) {
                const velocity = Math.min(127, config.p_playAllHands * note.velocity)
                webMidi.out(144, note.id, velocity)
            } else {
                webMidi.out(144, note.id, 0)
            }
        }
    }

    private playOutOfReach = (note: INote) => {
        const o = this
        const isBelowMin = note.id < config.p_minNote
        const isAboveMax = note.id > config.p_maxNote
        return config.p_playOutOfReachNotes && (isBelowMin || isAboveMax)
    }

    private getVelocity = (trackId: number, note: INote) => {
        const o = this
        let velocity = config.p_volumes[trackId] * note.velocity
        const maxVelocity = config.p_maxVelocity[trackId]
        if (maxVelocity && velocity > maxVelocity) {
            velocity = maxVelocity
        }
        return velocity
    }

}
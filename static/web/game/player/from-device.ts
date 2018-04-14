import { webMidi } from "../../web-midi/web-midi"

import { Scene } from "../scene/scene"
import { INote } from "../midi-parser/i-midi-parser"

function sendBackToDevice(kind: number, noteId: number, velocity: number) {
    if (kind < 242 && (kind < 127 || kind > 160)) {
        webMidi.out(kind, noteId, velocity)
    }
}

function execNoteOnFuncs(noteOnFuncs: any[], noteId: number) {
    for (let i = 0; i < noteOnFuncs.length; i++) {
        noteOnFuncs[i](noteId)
    }
}

export class FromDevice {

    private noteOnFuncs: ((noteId: number) => void)[] = []

    private oldTimeStamp = -1
    private oldVelocity = -1
    private oldId = -1

    constructor(private scene: Scene, private notes: INote[][]) {
        const o = this
        webMidi.outOpen()
        webMidi.out(0x80, 0, 0)
        webMidi.inOpen(o.deviceIn)
    }

    onNoteOn = (func: (noteId: number) => void) => {
        const o = this
        o.noteOnFuncs.push(func)
    }

    private deviceIn = (timeStamp: number, kind: number, noteId: number, velocity: number) => {
        const o = this
        sendBackToDevice(kind, noteId, velocity)
        const isNoteOn = kind === 144 && velocity > 0
        const isNoteOff = kind === 128 || (kind === 144 && velocity == 0)
        if (isNoteOn && !o.isDoubleNote(timeStamp, isNoteOn, noteId, velocity)) {
            o.scene.setPianoActiveId(noteId)
            execNoteOnFuncs(o.noteOnFuncs, noteId)
        } else if (isNoteOff) {
            o.scene.unsetPianoActiveId(noteId)
        }
    }

    private isDoubleNote = (timeStamp: number, isNoteOn: boolean, noteId: number, velocity: number) => {
        return false
        //const o = this
        //const isSimilarTime = Math.abs(timeStamp - o.oldTimeStamp) < 3
        //const idMaches = Math.abs(noteId - o.oldId) == 12 || Math.abs(noteId - o.oldId) == 24
        //const isDoubleNote = isSimilarTime && idMaches && velocity == o.oldVelocity
        //o.oldTimeStamp = timeStamp
        //o.oldVelocity = velocity
        //o.oldId = noteId
        //return isDoubleNote
    }

}


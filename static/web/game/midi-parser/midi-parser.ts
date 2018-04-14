import * as $ from 'jquery'

import { IParser, ISignature } from "./i-midi-parser"
import { MidiFile } from "./midifile"

function processMessage(o: IParser, v: any, time: any) {
    switch (v.subtype) {
        case "noteOn":
        case "noteOff":
            o.tracks[o.tracks.length - 1].push({
                on: v.subtype == "noteOn",
                time: time,
                id: v.noteNumber,
                velocity: v.velocity
            })
            break
        case "controller":
            if (v.controllerType == 64) { // sustain
                o.sustainNotes.push({ on: v.value > 63, time: time })
            }
            break
    }
}

function createSignature(signatures: { [msecs: number]: ISignature }, msecs: number) {
    if (!(msecs in signatures)) {
        const keys = Object.keys(signatures).map(v => parseFloat(v)).sort((a, b) => b - a)
        const fkeys = keys.filter(s => { return s < msecs })
        signatures[msecs] = $.extend({}, signatures[fkeys[0]])
    }
}

function processMeta(o: IParser, v: any, msecs: number) {
    switch (v.subtype) {
        case "setTempo":
            createSignature(o.signatures, msecs)
            o.signatures[msecs].msecsPerBeat = v.microsecondsPerBeat / 1e3
            break
        case "timeSignature":
            createSignature(o.signatures, msecs)
            o.signatures[msecs].beatsPerBar = v.numerator
            o.signatures[msecs].noteValuePerBeat = v.denominator
            break
    }
}

function evolveTimeRec(msecs: number, dticks: number, keys: number[], id: number, o: IParser): number {
    const msecsPerBeat = o.signatures[keys[id]].msecsPerBeat
    const new_msecs = msecs + msecsPerBeat * dticks / o.ticksPerBeat
    if (id - 1 >= 0 && new_msecs > keys[id - 1]) {
        const d_key_msec = keys[id - 1] - msecs + 1
        const dticks1 = dticks - d_key_msec * o.ticksPerBeat / msecsPerBeat
        return evolveTimeRec(msecs + d_key_msec, dticks1, keys, id - 1, o)
    } else {
        return new_msecs
    }
}

function findId(keys: number[], msecs: number) {
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] < msecs + 1) {
            return i
        }
    }
}

function parsePlayerTrack(o: IParser, track: any[]) {
    let msecs = 0
    o.tracks.push([])
    track.forEach((v) => {

        const keys = Object.keys(o.signatures).map(v => parseFloat(v)).sort((a, b) => b - a)
        const id = findId(keys, msecs)
        msecs = evolveTimeRec(msecs, v.deltaTime, keys, id as any, o)

        if (v.type == "meta") {
            processMeta(o, v, msecs)
        } else if (v.type == "channel") {
            processMessage(o, v, msecs)
        }
    })
}

function parsePlayerTracks(midi: any, o: IParser) {
    midi.tracks.forEach((track: any, i: number) => {
        parsePlayerTrack(o, track)
    })
    const tracks: any[] = []
    o.tracks.forEach((track) => {
        if (track.length > 0) {
            tracks.push(track)
        }
    })
    o.tracks = tracks
}

function parseHeader(midi: any, o: IParser) {
    o.ticksPerBeat = midi.header.ticksPerBeat
}

function computeMSecPerBars(o: IParser) {
    Object.keys(o.signatures).forEach(key => {
        const sig: ISignature = o.signatures[parseFloat(key)]
        sig.msecsPerBar = sig.msecsPerBeat * sig.beatsPerBar * 4.0 / sig.noteValuePerBeat
    })
}

function signaturesEqual(s1: ISignature, s2: ISignature) {
    const equal =
        s1.beatsPerBar == s2.beatsPerBar &&
        s1.msecsPerBar == s2.msecsPerBar &&
        s1.msecsPerBeat == s2.msecsPerBeat &&
        s1.noteValuePerBeat == s2.noteValuePerBeat
    return equal
}

function mergeSignatures(o: IParser) {
    const i = 1
    const keys = Object.keys(o.signatures).map(v => parseFloat(v)).sort((a, b) => a - b)
    const uniqueKeys = keys.map((key, i) => {
        return i == 0 || !signaturesEqual(o.signatures[key], o.signatures[keys[i - 1]])
    })
    uniqueKeys.forEach((isUnique, i) => {
        if (!isUnique) {
            delete o.signatures[keys[i]]
        }
    })
    if (uniqueKeys.some((v) => { return !v })) {
        mergeSignatures(o)
    }
}

export function parseMidi(midi: string): IParser {
    const midiFile = MidiFile(midi)
    const parser: IParser = {
        ticksPerBeat: 0,
        signatures: {
            0: {
                msecsPerBeat: 500,
                beatsPerBar: 4,
                noteValuePerBeat: 4,
                msecsPerBar: 2000
            }
        },
        tracks: [],
        sustainNotes: []
    }
    parseHeader(midiFile, parser)
    parsePlayerTracks(midiFile, parser)
    computeMSecPerBars(parser)
    mergeSignatures(parser)
    return parser
}


import { INoteScene, ISustainNoteScene } from "./i-song"
import { INote, ISustainNote, IParser } from "../midi-parser/i-midi-parser"
import { parseMidi } from "../midi-parser/midi-parser"
import { config } from "../../config/config"

function computeTimePerSong(playerTracks: INote[][]) {
    let timePerSong = 0
    playerTracks.forEach((notes) => {
        notes.forEach(function (note) {
            if (note.time > timePerSong) {
                timePerSong = note.time
            }
        })
    })
    return timePerSong
}

function computeCleanedPlayerTracks(sceneTracks: INoteScene[][]) {
    const playerTracks = sceneTracks.map((sceneNotes) => {
        const notesPlayer: INote[] = []
        sceneNotes.forEach((note) => {
            notesPlayer.push({
                on: true,
                time: note.timeOn,
                id: note.id,
                velocity: note.velocityOn,
                sceneNote: note
            })
            notesPlayer.push({
                on: false,
                time: note.timeOff,
                id: note.id,
                velocity: note.velocityOff
            })
        })
        return notesPlayer.sort((a, b) => {
            const dt = a.time - b.time
            if (dt !== 0) {
                return dt
            } else {
                return a.on ? 1 : -1
            }
        })
    })
    return playerTracks
}

function getMinMaxNoteId(sceneTracks: INoteScene[][]): any {
    let min = 1e6, max = -1e6
    sceneTracks.forEach((notes) => {
        notes.forEach((note) => {
            max = Math.max(note.id, max)
            min = Math.min(note.id, min)
        })
    })
    return { min: min, max: max }
}

function getSceneNote(noteOn: INote, noteOff: INote) {
    return {
        timeOn: noteOn.time,
        timeOff: noteOff.time,
        id: noteOn.id,
        velocityOn: noteOn.velocity,
        velocityOff: noteOff.velocity
    }
}

function computeSceneTracks(playerTracks: INote[][]) {
    const sceneTracks = playerTracks.map((playerNotes) => {
        const sceneNotes: INoteScene[] = [], tempNotes: any = {}
        playerNotes.forEach(function (note, i) {
            if (note.on) {
                if (tempNotes[note.id]) {
                    const noteScene = getSceneNote(tempNotes[note.id], note)
                    sceneNotes.push(noteScene)
                }
                tempNotes[note.id] = note
            } else {
                const tn = tempNotes[note.id]
                if (tn) {
                    const noteScene = getSceneNote(tempNotes[note.id], note)
                    sceneNotes.push(noteScene)
                    tempNotes[note.id] = undefined
                }
            }
        })
        return sceneNotes
    })
    return sceneTracks
}

function computeSceneSustainNotes(sustainNotes: ISustainNote[]) {
    const sceneSustainNotes: any[] = []
    let tempNote: ISustainNote | undefined
    sustainNotes.forEach((note) => {
        if (note.on) {
            if (tempNote) {
                sceneSustainNotes.push({ timeOn: tempNote.time, timeOff: note.time })
            }
            tempNote = note
        } else if (tempNote) {
            sceneSustainNotes.push({ timeOn: tempNote.time, timeOff: note.time })
            tempNote = undefined
        }
    })
    return sceneSustainNotes
}

function filterSustainNotes(sustainNotes: ISustainNote[]) {
    let last = false
    const filteredNotes = sustainNotes.filter((note) => {
        const isok = (note.on && !last) || (!note.on && last)
        last = note.on
        return isok
    })
    return filteredNotes
}

function getMeanVelocity(playerTracks: INote[][]) {
    let sumVelocity = 0, n = 0
    playerTracks.forEach((notes) => {
        notes.forEach((note) => {
            if (note.on) {
                n = n + 1
                sumVelocity += note.velocity
            }
        })
    })
    return sumVelocity / n
}

function normalizeVolumeOfPlayerTracks(playerTracks: INote[][]) {
    if (config.f_normalize) {
        const meanVel = getMeanVelocity(playerTracks)
        const scaleVel = config.f_normalize / meanVel
        if (scaleVel < 1.0) {
            playerTracks.forEach((notes) => {
                notes.forEach((note) => {
                    const limitVel = Math.min(127, scaleVel * note.velocity)
                    note.velocity = Math.max(0, limitVel)
                })
            })
        }
    }
}

function sortPlayerTracksByHands(playerTracks: INote[][]) {
    return config.f_trackIds.map((trackId) => {
        return playerTracks[trackId] || []
    })
}

export class Song {
    midi: IParser
    timePerSong: number
    playedNoteID: any
    sceneTracks: INoteScene[][]
    sceneSustainNotes: ISustainNoteScene[]

    constructor(data: string) {
        const o = this
        o.midi = parseMidi(data)
        o.midi.tracks = sortPlayerTracksByHands(o.midi.tracks)
        normalizeVolumeOfPlayerTracks(o.midi.tracks)
        o.midi.sustainNotes = filterSustainNotes(o.midi.sustainNotes)
        o.sceneSustainNotes = computeSceneSustainNotes(o.midi.sustainNotes)
        o.sceneTracks = computeSceneTracks(o.midi.tracks)
        o.playedNoteID = getMinMaxNoteId(o.sceneTracks)
        o.midi.tracks = computeCleanedPlayerTracks(o.sceneTracks)
        o.timePerSong = computeTimePerSong(o.midi.tracks)
    }
}
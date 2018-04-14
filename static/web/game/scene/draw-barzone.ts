import { hexToRgb, IDrawRect } from "./utils"
import { whiteNoteIds, blackNoteIds, blackNoteSpots } from "./note-ids"
import { ISignature } from "../midi-parser/i-midi-parser"

const octaveLineColor = hexToRgb("#808080")
const leftTrackWhiteNoteBackgroundColor = hexToRgb("#ffffff")
const leftTrackBlackNoteBackgroundColor = hexToRgb("#ffffff")
const tooLateZoneColor = hexToRgb("#ffffff")
const barLineColor = hexToRgb("#808080")
const notePlayedColor = hexToRgb("#ffffff", 0.15)
const notePlayedColor2 = hexToRgb("#ffffff", 0.001)
const sustainColor = hexToRgb("#00ff90")

const colors = [
    "#FA0B0C",
    "#F44712",
    "#F88010",
    "#F5D23B",
    "#B5B502",
    "#149033",
    "#1B9081",
    "#7D6AFD",
    "#A840FD",
    "#7F087C",
    "#fc028b",
    "#D71386"
].map(v => hexToRgb(v))

const leftTrackColorPadding = (blackKeyWidth: number) => Math.ceil(0.15 * blackKeyWidth)
const tooLateZoneWidth = (pianoHeight: number) => Math.ceil(0.01 * pianoHeight)

function drawBlackNote(drawRect: IDrawRect, noteID: number, noteUID: number, isLeftTrack: boolean, whiteKeyWidth: number, blackKeyWidth: number, y0: number, y1: number, color: number[]) {
    const pos = blackNoteIds.indexOf(noteID)
    if (pos >= 0) {
        const x0 = blackNoteSpots[pos] * whiteKeyWidth - blackKeyWidth / 2
        const x1 = x0 + blackKeyWidth
        if (isLeftTrack) {
            let padding = leftTrackColorPadding(blackKeyWidth)
            drawRect(x0, y0, x1, y1, [100000 + noteUID], leftTrackBlackNoteBackgroundColor, notePlayedColor)
            drawRect(x0 + padding, y0, x1 - padding, y1, [100000 + noteUID], color, notePlayedColor2)
        } else {
            drawRect(x0, y0, x1, y1, [200000 + noteUID], color, notePlayedColor)
        }
    }
}

function drawWhiteNote(drawRect: IDrawRect, noteID: number, noteUID: number, isLeftTrack: boolean, whiteKeyWidth: number, blackKeyWidth: number, y0: number, y1: number, color: number[]) {
    const ipos = whiteNoteIds.indexOf(noteID)
    if (ipos >= 0) {
        const x0 = ipos * whiteKeyWidth + 2
        const x1 = x0 + whiteKeyWidth - 2 * 2
        if (isLeftTrack) {
            let padding = leftTrackColorPadding(whiteKeyWidth)
            drawRect(x0, y0, x1, y1, [100000 + noteUID], leftTrackWhiteNoteBackgroundColor, notePlayedColor)
            drawRect(x0 + padding, y0, x1 - padding, y1, [100000 + noteUID], color, notePlayedColor2)
        } else {
            drawRect(x0, y0, x1, y1, [200000 + noteUID], color, notePlayedColor)
        }
    }
}

function iterateNotes(drawRect: IDrawRect, whiteKeyWidth: number, blackKeyWidth: number, tracks: any[][], start_y: number, pixelsPerTime: number, drawNote: any) {
    tracks.forEach((track, trackID) => {
        track.forEach(function (note) {
            const y0 = start_y + pixelsPerTime * note.timeOn + 2
            let y1 = start_y + pixelsPerTime * note.timeOff - 2
            if (y1 - y0 < 5) {
                y1 = y0 + 5
            }
            const color = colors[note.id % 12]
            drawNote(drawRect, note.id, note.uid, trackID === 0, whiteKeyWidth, blackKeyWidth, y0, y1, color)
        })
    })
}

function drawBarLines(drawRect: IDrawRect, tracks: any[][], pixelsPerTime: number, whiteKeyWidth: number, start_y: number, signatures: { [msecs: number]: ISignature }) {
    let maxTime = 0
    tracks.forEach((t) => {
        if (t.length > 0) {
            maxTime = Math.max(t[t.length - 1].timeOff, maxTime)
        }
    })

    const keys = Object.keys(signatures).sort((a, b) => Number(a) - Number(b))
    keys.forEach((key, i) => {
        const startTime = Number(key)
        if (i + 1 < keys.length) {
            const endTime = Number(keys[i + 1])
            const step = signatures[startTime].msecsPerBeat
            const n = Math.round((endTime - startTime) / step)
            const newStep = (endTime - startTime) / n
            for (let j = (i == 0 ? -2 : 0); j < n; j++) {
                const time = startTime + j * newStep
                const y = start_y + pixelsPerTime * time
                const x1 = (whiteNoteIds.length + 1) * whiteKeyWidth
                if (j == 0) {
                    drawRect(0, y - 2, x1, y + 2, [200], barLineColor, barLineColor)
                } else {
                    drawRect(0, y, x1, y + 1, [200], barLineColor, barLineColor)
                }
            }
        } else {
            const step = signatures[startTime].msecsPerBeat
            const n = Math.ceil((maxTime - startTime) / step)
            for (let j = 0; j < n; j++) {
                const time = startTime + j * step
                const y = start_y + pixelsPerTime * time
                const x1 = (whiteNoteIds.length + 1) * whiteKeyWidth
                drawRect(0, y, x1, y + 1, [200], barLineColor, barLineColor)
            }
        }
    })
}

function drawOctaveLines(drawRect: IDrawRect, whiteKeyWidth: number, pianoHeight: number, sceneHeight: number) {
    whiteNoteIds.forEach((id, i) => {
        if (id % 12 == 0) {
            const x0 = i * whiteKeyWidth
            drawRect(x0, pianoHeight, x0 + 1, sceneHeight, [id], octaveLineColor, octaveLineColor)
        }
    })
}

function drawTooLateZone(drawRect: IDrawRect, pianoHeight: number, pianoWidth: number, start_y: number) {
    drawRect(0, start_y - tooLateZoneWidth(pianoHeight), pianoWidth, start_y, [11], tooLateZoneColor, tooLateZoneColor)
}

function labelNotes(tracks: any[][]) {
    tracks.forEach((track) => {
        const sorted = track.sort((a, b) => a.timeOn - b.timeOn)
        sorted.forEach((note, i) => note.uid = i + 1)
    })
}

function drawSustainNotes(drawRect: IDrawRect, sustainNotes: any[], start_y: number, pixelsPerTime: number, whiteKeyWidth: number) {
    sustainNotes.forEach((note) => {
        const y0 = start_y + pixelsPerTime * note.timeOn + 1
        const y1 = start_y + pixelsPerTime * note.timeOff - 2
        const ipos = whiteNoteIds.length
        const x0 = ipos * whiteKeyWidth + 3
        const x1 = x0 + whiteKeyWidth - 5
        drawRect(x0, y0, x1, y1, [200], sustainColor, sustainColor)
    })
}

export function drawBarzone(drawRect: IDrawRect, whiteKeyWidth: number, blackKeyWidth: number, sceneHeight: number, tracks: any[][], start_y: number, pixelsPerTime: number, pianoHeight: number, pianoWidth: number, signatures: { [msecs: number]: ISignature }, sustainNotes: any[]) {
    labelNotes(tracks)
    drawOctaveLines(drawRect, whiteKeyWidth, pianoHeight, sceneHeight)
    drawBarLines(drawRect, tracks, pixelsPerTime, whiteKeyWidth, start_y, signatures)
    drawSustainNotes(drawRect, sustainNotes, start_y, pixelsPerTime, whiteKeyWidth)
    iterateNotes(drawRect, whiteKeyWidth, blackKeyWidth, tracks, start_y, pixelsPerTime, drawWhiteNote)
    iterateNotes(drawRect, whiteKeyWidth, blackKeyWidth, tracks, start_y, pixelsPerTime, drawBlackNote)
    // drawTooLateZone(drawRect, pianoHeight, pianoWidth, start_y)
}
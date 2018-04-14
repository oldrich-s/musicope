import { config } from "../../config/config"
import { whiteNoteIds, blackNoteIds, noteRanges, blackNoteSpots } from "./note-ids"
import { hexToRgb, IDrawRect } from "./utils"

const aboveNotesMargin = (pianoHeight: number) => Math.ceil(0.01 * pianoHeight)
const belowNotesMargin = (pianoHeight: number) => Math.ceil(0.06 * pianoHeight)
const timebarHeight = (pianoHeight: number) => Math.ceil(0.08 * pianoHeight)
const whiteKeySpacing = (pianoHeight: number) => Math.ceil(0.005 * pianoHeight)
const blackKeyBottomEdge = (pianoHeight: number) => Math.ceil(0.4 * pianoHeight)

const backgroundColor = hexToRgb("#000000")
const whiteKeyColor = hexToRgb("#ffffff")
const whiteKeyColor_pressed = hexToRgb("#2c79b2")
const whiteKeyColor_unplayed_reachable = hexToRgb("#00ff90")
const whiteKeyColor_unplayed_outOfReach = hexToRgb("#808080")
const whiteKeyColor_played_outOfReach = hexToRgb("#ff5252")
const blackKeyColor = hexToRgb("#000000")
const blackKeyColor_pressed = hexToRgb("#3faeff")
const timebar_backgroundColor = hexToRgb("#ffffff")
const timebar_activeColor = hexToRgb("#0094ff")

function drawPianoTimeBarColor(drawRect: IDrawRect, pianoHeight: number) {
    drawRect(0, pianoHeight - timebarHeight(pianoHeight), 1, pianoHeight, [1, 2, 2, 1], timebar_activeColor, timebar_activeColor)
}

function drawPianoTimeBarWhite(drawRect: IDrawRect, pianoHeight: number, pianoWidth: number) {
    drawRect(0, pianoHeight - timebarHeight(pianoHeight), pianoWidth, pianoHeight, [2, 1, 1, 2], timebar_backgroundColor, timebar_backgroundColor)
}

function drawTimeBar(drawRect: IDrawRect, pianoHeight: number, pianoWidth: number) {
    drawPianoTimeBarWhite(drawRect, pianoHeight, pianoWidth)
    drawPianoTimeBarColor(drawRect, pianoHeight)
}

function drawBlackNotes(drawRect: IDrawRect, whiteKeyWidth: number, blackKeyWidth: number, pianoHeight: number) {
    blackNoteIds.forEach((id, i) => {
        const x0 = blackNoteSpots[i] * whiteKeyWidth - blackKeyWidth / 2
        const x1 = x0 + blackKeyWidth
        const y0 = blackKeyBottomEdge(pianoHeight)
        const y1 = pianoHeight - timebarHeight(pianoHeight) - aboveNotesMargin(pianoHeight)
        drawRect(x0, y0, x1, y1, [id], blackKeyColor, blackKeyColor_pressed)
    })
}

function getColorForWhitePianoNotes(id: number, minNoteId: number, maxNoteId: number, pianoKeys: number) {
    const isNeverPlayedNote = id < minNoteId || id > maxNoteId
    const isOutOfReachNote = id < noteRanges[pianoKeys][0] || id > noteRanges[pianoKeys][1]
    if (isNeverPlayedNote && !isOutOfReachNote) {
        return whiteKeyColor_unplayed_reachable
    } else if (isNeverPlayedNote) {
        return whiteKeyColor_unplayed_outOfReach
    } else if (isOutOfReachNote) {
        return whiteKeyColor_played_outOfReach
    } else {
        return whiteKeyColor
    }
}

function drawWhiteNotes(drawRect: IDrawRect, whiteKeyWidth: number, pianoHeight: number, minNoteId: number, maxNoteId: number, pianoKeys: number) {
    whiteNoteIds.forEach((id, i) => {
        const x0 = i * whiteKeyWidth
        const x1 = x0 + whiteKeyWidth - whiteKeySpacing(pianoHeight)
        const y0 = belowNotesMargin(pianoHeight)
        const y1 = pianoHeight - aboveNotesMargin(pianoHeight) - timebarHeight(pianoHeight)
        const color = getColorForWhitePianoNotes(id, minNoteId, maxNoteId, pianoKeys)
        drawRect(x0, y0, x1, y1, [id], color, whiteKeyColor_pressed)
    })
}

function drawBackground(drawRect: IDrawRect, pianoWidth: number, pianoHeight: number) {
    drawRect(0, 0, pianoWidth, pianoHeight, [150], backgroundColor, backgroundColor)
}

export function drawPiano(drawRect: IDrawRect, pianoKeys: number, pianoWidth: number, pianoHeight: number, whiteKeyWidth: number, blackKeyWidth: number, minNoteId: number, maxNoteId: number) {
    if (config.s_showPiano) {
        drawBackground(drawRect, pianoWidth, pianoHeight)
        drawWhiteNotes(drawRect, whiteKeyWidth, pianoHeight, minNoteId, maxNoteId, pianoKeys)
        drawBlackNotes(drawRect, whiteKeyWidth, blackKeyWidth, pianoHeight)
        drawTimeBar(drawRect, pianoHeight, pianoWidth)
    }
}
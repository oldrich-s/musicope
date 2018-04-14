import { ISignature } from "../midi-parser/i-midi-parser"
import { config } from "../../config/config"
import { INoteScene, ISustainNoteScene } from "../song/i-song"
import { whiteNoteIds } from "./note-ids"
import { drawPiano } from "./draw-piano"
import { drawBarzone } from "./draw-barzone"
import { IDrawRect } from "./utils"

// function drawNoteCover(loc: Local) {
//     if (config.s_noteCoverRelHeight > 0.0) {
//         const y0 = loc.yEndOfTimeBar
//         const y1 = y0 + config.s_noteCoverRelHeight * (loc.input.sceneHeight - loc.yEndOfTimeBar)
//         const color = [0, 0, 0, 1]
//         const activeColor = [0, 0, 0, 0.5]
//         loc.input.drawRect(0, y0, loc.input.sceneWidth + 1, y1, [1], color, activeColor)
//     }
// }

export function drawScene(drawRect: IDrawRect, sceneWidth: number, sceneHeight: number, pixelsPerTime: number, tracks: any[][], minPlayedNote: number, maxPlayedNote: number, signatures: { [msecs: number]: ISignature }, sustainNotes: any[]) {
    const whiteKeyWidth = Math.floor(sceneWidth / whiteNoteIds.length)
    const blackKeyWidth = Math.round(0.45 * whiteKeyWidth)
    const pianoHeight = Math.ceil(0.2 * sceneHeight)
    const start_y = pianoHeight + pixelsPerTime * config.p_wait_ms

    // const timePerSceneHeigth = sceneHeight / pixelsPerTime
    // const timeBarHeight = sceneHeight * config.p_wait_ms / timePerSceneHeigth
    
    // const loc: Local = {
    //     xRemainder: input.sceneWidth - whiteWidth * whiteNoteIds.length,
    // }

    drawBarzone(drawRect, whiteKeyWidth, blackKeyWidth, sceneHeight, tracks, start_y, pixelsPerTime, pianoHeight, sceneWidth, signatures, sustainNotes)
    drawPiano(drawRect, 88, sceneWidth, pianoHeight, whiteKeyWidth, blackKeyWidth, minPlayedNote, maxPlayedNote)

}
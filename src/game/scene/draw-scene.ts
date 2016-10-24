import { ISignature } from "../midi-parser/i-midi-parser";
import { config } from "../../config/config";
import { INoteScene, ISustainNoteScene } from "../song/i-song";
import { whiteNoteIds } from "./note-ids";
import { drawPiano } from "./draw-piano";
import { drawBarzone } from "./draw-barzone";
import { IDrawRect } from "./utils";



// function drawNoteCover(loc: Local) {
//     if (config.s_noteCoverRelHeight > 0.0) {
//         var y0 = loc.yEndOfTimeBar;
//         var y1 = y0 + config.s_noteCoverRelHeight * (loc.input.sceneHeight - loc.yEndOfTimeBar);
//         var color = [0, 0, 0, 1];
//         var activeColor = [0, 0, 0, 0.5];
//         loc.input.drawRect(0, y0, loc.input.sceneWidth + 1, y1, [1], color, activeColor);
//     }
// }
// function drawSustainNotes(loc: Local) {
//     var color = hexToRgb(config.s_colSustain);
//     loc.input.sustainNotes.forEach((note) => {
//         var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 1;
//         var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
//         var ipos = whiteNoteIds.length;
//         var x0 = ipos * loc.whiteWidth + 3;
//         var x1 = x0 + loc.whiteWidth - 5;
//         loc.input.drawRect(x0, y0, x1, y1, [200], color, color);
//     });
// }

export function drawScene(drawRect: IDrawRect, sceneWidth: number, sceneHeight: number, pixelsPerTime: number, tracks: any[][], minPlayedNote: number, maxPlayedNote: number) {
    var whiteKeyWidth = Math.floor(sceneWidth / whiteNoteIds.length);
    var blackKeyWidth = Math.round(0.45 * whiteKeyWidth);
    var pianoHeight = Math.ceil(0.2 * sceneHeight);
    var start_y = pianoHeight + pixelsPerTime * 500;

    var timePerSceneHeigth = sceneHeight / pixelsPerTime;
    var timeBarHeight = sceneHeight * config.p_radius / timePerSceneHeigth;
    
    // var loc: Local = {
    //     xRemainder: input.sceneWidth - whiteWidth * whiteNoteIds.length,
    // }

    drawBarzone(drawRect, whiteKeyWidth, blackKeyWidth, sceneHeight, tracks, start_y, pixelsPerTime, pianoHeight, sceneWidth);
    drawPiano(drawRect, 88, sceneWidth, pianoHeight, whiteKeyWidth, blackKeyWidth, minPlayedNote, maxPlayedNote);

}
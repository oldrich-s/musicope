import { config } from "../../config/config";
import { whiteNoteIds, blackNoteIds, noteRanges, blackNoteSpots } from "./note-ids";
import { hexToRgb, IDrawRect } from "./utils";

var aboveNotesMargin = pianoHeight => Math.ceil(0.01 * pianoHeight);
var belowNotesMargin = pianoHeight => Math.ceil(0.06 * pianoHeight);
var timebarHeight = pianoHeight => Math.ceil(0.08 * pianoHeight);
var whiteKeySpacing = pianoHeight => Math.ceil(0.005 * pianoHeight);
var blackKeyBottomEdge = pianoHeight => Math.ceil(0.4 * pianoHeight);

var backgroundColor = hexToRgb("#000000");
var whiteKeyColor = hexToRgb("#ffffff");
var whiteKeyColor_pressed = hexToRgb("#2c79b2");
var whiteKeyColor_unplayed_reachable = hexToRgb("#00ff90");
var whiteKeyColor_unplayed_outOfReach = hexToRgb("#808080");
var whiteKeyColor_played_outOfReach = hexToRgb("#ff5252");
var blackKeyColor = hexToRgb("#000000");
var blackKeyColor_pressed = hexToRgb("#3faeff");
var timebar_backgroundColor = hexToRgb("#ffffff");
var timebar_activeColor = hexToRgb("#0094ff");

function drawPianoTimeBarColor(drawRect: IDrawRect, pianoHeight: number) {
    drawRect(0, pianoHeight - timebarHeight(pianoHeight), 1, pianoHeight, [1, 2, 2, 1], timebar_activeColor, timebar_activeColor);
}

function drawPianoTimeBarWhite(drawRect: IDrawRect, pianoHeight: number, pianoWidth: number) {
    drawRect(0, pianoHeight - timebarHeight(pianoHeight), pianoWidth, pianoHeight, [2, 1, 1, 2], timebar_backgroundColor, timebar_backgroundColor);
}

function drawTimeBar(drawRect: IDrawRect, pianoHeight: number, pianoWidth: number) {
    drawPianoTimeBarWhite(drawRect, pianoHeight, pianoWidth);
    drawPianoTimeBarColor(drawRect, pianoHeight);
}

function drawBlackNotes(drawRect: IDrawRect, whiteKeyWidth: number, blackKeyWidth: number, pianoHeight: number) {
    blackNoteIds.forEach((id, i) => {
        var x0 = blackNoteSpots[i] * whiteKeyWidth - blackKeyWidth / 2;
        var x1 = x0 + blackKeyWidth;
        var y0 = blackKeyBottomEdge(pianoHeight);
        var y1 = pianoHeight - timebarHeight(pianoHeight) - aboveNotesMargin(pianoHeight);
        drawRect(x0, y0, x1, y1, [id], blackKeyColor, blackKeyColor_pressed);
    });
}

function getColorForWhitePianoNotes(id: number, minNoteId: number, maxNoteId: number, pianoKeys: number) {
    var isNeverPlayedNote = id < minNoteId || id > maxNoteId;
    var isOutOfReachNote = id < noteRanges[pianoKeys][0] || id > noteRanges[pianoKeys][1];
    if (isNeverPlayedNote && !isOutOfReachNote) {
        return whiteKeyColor_unplayed_reachable;
    } else if (isNeverPlayedNote) {
        return whiteKeyColor_unplayed_outOfReach;
    } else if (isOutOfReachNote) {
        return whiteKeyColor_played_outOfReach;
    } else {
        return whiteKeyColor;
    }
}

function drawWhiteNotes(drawRect: IDrawRect, whiteKeyWidth: number, pianoHeight: number, minNoteId: number, maxNoteId: number, pianoKeys: number) {
    whiteNoteIds.forEach((id, i) => {
        var x0 = i * whiteKeyWidth;
        var x1 = x0 + whiteKeyWidth - whiteKeySpacing(pianoHeight);
        var y0 = belowNotesMargin(pianoHeight);
        var y1 = pianoHeight - aboveNotesMargin(pianoHeight) - timebarHeight(pianoHeight);
        var color = getColorForWhitePianoNotes(id, minNoteId, maxNoteId, pianoKeys);
        drawRect(x0, y0, x1, y1, [id], color, whiteKeyColor_pressed);
    });
}

function drawBackground(drawRect: IDrawRect, pianoWidth: number, pianoHeight: number) {
    drawRect(0, 0, pianoWidth, pianoHeight, [150], backgroundColor, backgroundColor);
}

export function drawPiano(drawRect: IDrawRect, pianoKeys: number, pianoWidth: number, pianoHeight: number, whiteKeyWidth: number, blackKeyWidth: number, minNoteId: number, maxNoteId: number) {
    if (config.s_showPiano) {
        drawBackground(drawRect, pianoWidth, pianoHeight);
        drawWhiteNotes(drawRect, whiteKeyWidth, pianoHeight, minNoteId, maxNoteId, pianoKeys);
        drawBlackNotes(drawRect, whiteKeyWidth, blackKeyWidth, pianoHeight);
        drawTimeBar(drawRect, pianoHeight, pianoWidth);
    }
}
import { hexToRgb, IDrawRect } from "./utils";
import { whiteNoteIds, blackNoteIds, blackNoteSpots } from "./note-ids";

var octaveLineColor = hexToRgb("#808080");
var leftTrackNoteBackgroundColor = hexToRgb("#ffffff");

var leftTrackColorPadding = blackKeyWidth => Math.ceil(0.1 * blackKeyWidth);

function drawBlackNote(drawRect: IDrawRect, noteID: number, isLeftTrack: boolean, whiteKeyWidth: number, blackKeyWidth: number, y0: number, y1: number, color: number[]) {
    var pos = blackNoteIds.indexOf(noteID);
    var x0 = blackNoteSpots[pos] * whiteKeyWidth - blackKeyWidth / 2;
    var x1 = x0 + blackKeyWidth;
    if (isLeftTrack) {
        var padding = leftTrackColorPadding(blackKeyWidth);
        drawRect(x0, y0, x1, y1, [202], leftTrackNoteBackgroundColor, leftTrackNoteBackgroundColor);
        drawRect(x0 + padding, y0, x1 - padding, y1, [202], color, color);
    } else {
        drawRect(x0, y0, x1, y1, [203], color, color);
    }
}

function drawWhiteNote(loc: Local, trackId: number, note: INoteScene, y0: number, y1: number, color: number[]) {
    var ipos = whiteNoteIds.indexOf(note.id);
    var f = trackId == 0 ? 4 : 0;
    var x0 = ipos * whiteKeyWidth;
    var x1 = x0 + loc.whiteWidth - 5;
    loc.input.drawRect(x0, y0, x1, y1, [trackId + 200], white, white);
    loc.input.drawRect(x0 + f, y0, x1 - f, y1, [trackId + 200], color, color);

}

function iterateNotes(fn) {
    config.s_views.forEach((view, trackId) => {
        if (view === "full") {
            loc.input.tracks[trackId].forEach(function (note) {
                var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 2;
                var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
                var color = hexToRgb(colors[note.id % 12]);
                fn(loc, trackId, note, y0, y1, color);
            });
        }
    });
}

function drawBarLines() {

    var maxTime = 0;
    loc.input.tracks.forEach((t) => {
        if (t.length > 0) {
            maxTime = Math.max(t[t.length - 1].timeOff, maxTime);
        }
    });

    var color = hexToRgb(cLineColor);

    var keys = Object.keys(loc.input.signatures).sort((a, b) => Number(a) - Number(b));
    keys.forEach((key, i) => {
        var startTime = Number(key);
        if (i + 1 < keys.length) {
            var endTime = Number(keys[i + 1]);
            var step = loc.input.signatures[startTime].msecsPerBar;
            var n = Math.round((endTime - startTime) / step);
            var newStep = (endTime - startTime) / n;
            for (var j = (i == 0 ? -2 : 0); j < n; j++) {
                var time = startTime + j * newStep;
                var y = loc.yEndOfTimeBar + loc.input.pixelsPerTime * time;
                var x1 = (whiteNoteIds.length + 1) * loc.whiteWidth;
                if (j == 0) {
                    loc.input.drawRect(0, y - 2, x1, y + 2, [200], color, color);
                } else {
                    loc.input.drawRect(0, y, x1, y + 1, [200], color, color);
                }
            }
        } else {
            var step = loc.input.signatures[startTime].msecsPerBar;
            var n = Math.ceil((maxTime - startTime) / step);
            for (var j = 0; j < n; j++) {
                var time = startTime + j * step;
                var y = loc.yEndOfTimeBar + loc.input.pixelsPerTime * time;
                var x1 = (whiteNoteIds.length + 1) * loc.whiteWidth;
                loc.input.drawRect(0, y, x1, y + 1, [200], color, color);
            }
        }
    });
}

function drawOctaveLines(drawRect: IDrawRect, whiteKeyWidth: number, pianoHeight: number, sceneHeight: number) {
    whiteNoteIds.forEach((id, i) => {
        if (id % 12 == 0) {
            var x0 = i * whiteKeyWidth;
            drawRect(x0, pianoHeight, x0 + 1, sceneHeight, [id], octaveLineColor, octaveLineColor);
        }
    });
}

export function drawBarzone() {

}
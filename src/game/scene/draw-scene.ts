import { ISignature } from "../midi-parser/i-midi-parser";
import { config } from "../../config/config";
import { INoteScene, ISustainNoteScene } from "../song/i-song";

var white = hexToRgb("#ffffff");

export interface Input {
    drawRect(x0: number, y0: number, x1: number, y1: number, ids: number[], color: number[], activeColor: number[]): void;
    pixelsPerTime: number;
    sceneWidth: number;
    sceneHeight: number;
    tracks: INoteScene[][];
    sustainNotes: ISustainNoteScene[];
    p_minNote: number;
    p_maxNote: number;
    signatures: { [msecs: number]: ISignature };
    playedNoteID: IMinMax;
}

interface Local {
    blackWidth: number;
    yEndOfPiano: number;
    yEndOfTimeBar: number;
    xRemainder: number;
    whiteWidth: number;
    input: Input;
}

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRgb(hex: string, alpha?: number) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = (<any>hex.replace)(shorthandRegex, function(m, r, g, b) { return <string>(r + r + g + g + b + b); });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255, alpha || 1];
}

var whiteNoteIds = [
    21, 23,
    24, 26, 28, 29, 31, 33, 35,
    36, 38, 40, 41, 43, 45, 47,
    48, 50, 52, 53, 55, 57, 59,
    60, 62, 64, 65, 67, 69, 71,
    72, 74, 76, 77, 79, 81, 83,
    84, 86, 88, 89, 91, 93, 95,
    96, 98, 100, 101, 103, 105, 107,
    108];

var blackNoteIds = [
    22,
    25, 27, 30, 32, 34,
    37, 39, 42, 44, 46,
    49, 51, 54, 56, 58,
    61, 63, 66, 68, 70,
    73, 75, 78, 80, 82,
    85, 87, 90, 92, 94,
    97, 99, 102, 104, 106];

var blackNoteSpots = [
    1, 3, 4, 6, 7, 8, 10, 11, 13, 14, 15, 17, 18, 20, 21, 22, 24, 25, 27, 28, 29, 31, 32,
    34, 35, 36, 38, 39, 41, 42, 43, 45, 46, 48, 49, 50];

var colors = [
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
    "#A61586",
    "#D71386"
];

var cLineColor = "#808080";

function drawNoteCover(loc: Local) {
    if (config.s_noteCoverRelHeight > 0.0) {
        var y0 = loc.yEndOfTimeBar;
        var y1 = y0 + config.s_noteCoverRelHeight * (loc.input.sceneHeight - loc.yEndOfTimeBar);
        var color = [0, 0, 0, 1];
        var activeColor = [0, 0, 0, 0.5];
        loc.input.drawRect(0, y0, loc.input.sceneWidth + 1, y1, [1], color, activeColor);
    }
}

function drawPianoBlackNotes(loc: Local) {
    blackNoteIds.forEach((id, i) => {
        var x0 = blackNoteSpots[i] * loc.whiteWidth - loc.blackWidth + 2;
        var x1 = x0 + 2 * loc.blackWidth - 3;
        var y0 = Math.floor(loc.yEndOfPiano * 0.4);
        var y1 = loc.yEndOfPiano - 2;
        var activeColor = hexToRgb(config.s_colPianoBlack);
        loc.input.drawRect(x0, y0, x1, y1, [id], [0, 0, 0, 1], activeColor);
    });
}

function getColorForWhitePianoNotes(id: number, loc: Local) {
    var unPressedColor = [1, 1, 1, 1];
    var neverPlayedNote = id < loc.input.playedNoteID.min || id > loc.input.playedNoteID.max;
    var outOfReachNote = id < loc.input.p_minNote || id > loc.input.p_maxNote;
    var color;
    if (neverPlayedNote && !outOfReachNote) {
        var notPlayedColor = hexToRgb(config.s_colUnPlayedNotesInReach);
        color = notPlayedColor;
    } else if (neverPlayedNote) {
        var notPlayedColor = hexToRgb(config.s_colUnPlayedNotes);
        color = notPlayedColor;
    } else if (outOfReachNote) {
        var outOfReachColor = hexToRgb(config.s_colOutOfReachNotes);
        color = outOfReachColor;
    } else {
        color = unPressedColor;
    }
    return color;
}

function drawPianoWhiteNotes(loc: Local) {
    whiteNoteIds.forEach((id, i) => {
        var x0 = i * loc.whiteWidth;
        var x1 = x0 + loc.whiteWidth - 1;
        var y0 = 12;
        var y1 = loc.yEndOfPiano - 2;
        var color = getColorForWhitePianoNotes(id, loc);
        var activeColor = hexToRgb(config.s_colPianoWhite);
        loc.input.drawRect(x0, y0, x1, y1, [id], color, activeColor);
    });
}

function drawPianoTimeBarColor(loc: Local) {
    var color = hexToRgb(config.s_colTime, 1);
    var activeColor = hexToRgb(config.s_colTime, 0.5);
    var y0 = loc.yEndOfPiano;
    var y1 = loc.yEndOfTimeBar;
    loc.input.drawRect(0, y0, 1, y1, [1, 2, 2, 1], color, activeColor);
}

function drawPianoTimeBarWhite(loc: Local) {
    var y0 = loc.yEndOfPiano;
    var y1 = loc.yEndOfTimeBar;
    var color = [1, 1, 1, 1];
    var activeColor = [1, 1, 1, 0.5]
    loc.input.drawRect(0, y0, loc.input.sceneWidth, y1, [2, 1, 1, 2], color, activeColor);
    loc.input.drawRect(0, 2 * y1 - y0 - 2, loc.input.sceneWidth, 2 * y1 - y0, [3, 3, 3, 3], [0 / 255, 150 / 255, 0 / 255, 1], activeColor);
}

function drawPianoBackBlack(loc: Local) {
    var y1 = loc.yEndOfPiano;
    loc.input.drawRect(0, 0, loc.input.sceneWidth + 1, y1, [150], [0, 0, 0, 1], [0, 0, 0, 1]);
}

function drawTimeBar(loc: Local) {
    drawPianoTimeBarWhite(loc);
    drawPianoTimeBarColor(loc);
}

function drawPiano(loc: Local) {
    if (config.s_showPiano) {
        drawPianoBackBlack(loc);
        drawPianoWhiteNotes(loc);
        drawPianoBlackNotes(loc);
    }
}

function drawSustainNotes(loc: Local) {
    var color = hexToRgb(config.s_colSustain);
    loc.input.sustainNotes.forEach((note) => {
        var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 1;
        var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
        var ipos = whiteNoteIds.length;
        var x0 = ipos * loc.whiteWidth + 3;
        var x1 = x0 + loc.whiteWidth - 5;
        loc.input.drawRect(x0, y0, x1, y1, [200], color, color);
    });
}

function getColorByVelocity(color: number[], velocity: number, minMaxVel: number[]) {
    if (Math.abs(minMaxVel[1] - minMaxVel[0]) > 10) {
        var out = [];
        var scale = 0.6 + 0.4 * (velocity - minMaxVel[0]) / (minMaxVel[1] - minMaxVel[0]);
        out.push(scale * color[0]);
        out.push(scale * color[1]);
        out.push(scale * color[2]);
        out.push(color[3]);
        return out;
    } else {
        return color;
    }
}

function drawBlackNote(loc: Local, trackId: number, note: INoteScene, y0: number, y1: number, color: number[]) {
    var pos = blackNoteIds.indexOf(note.id);
    if (pos >= 0) {
        var f = trackId == 0 ? 3 : 0;
        var x0 = blackNoteSpots[pos] * loc.whiteWidth - loc.blackWidth + 2;
        var x1 = x0 + 2 * loc.blackWidth - 3;
        loc.input.drawRect(x0, y0, x1, y1, [trackId + 202], white, white);
        loc.input.drawRect(x0 + f, y0, x1 - f, y1, [trackId + 202], color, color);
    }
}

function drawWhiteNote(loc: Local, trackId: number, note: INoteScene, y0: number, y1: number, color: number[]) {
    var ipos = whiteNoteIds.indexOf(note.id);
    if (ipos >= 0) {
        var f = trackId == 0 ? 4 : 0;
        var x0 = ipos * loc.whiteWidth + 3;
        var x1 = x0 + loc.whiteWidth - 5;
        loc.input.drawRect(x0, y0, x1, y1, [trackId + 200], white, white);
        loc.input.drawRect(x0 + f, y0, x1 - f, y1, [trackId + 200], color, color);
    }
}

function iterateNotes(loc: Local, fn) {
    config.s_views.forEach((view, trackId) => {
        if (view === "full") {
            loc.input.tracks[trackId].forEach(function(note) {
                var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 2;
                var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
                var color = hexToRgb(colors[note.id % 12]);
                fn(loc, trackId, note, y0, y1, color);
            });
        }
    });
}

function drawBarLines(loc: Local) {

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

function drawCLines(loc: Local) {
    var color = hexToRgb(cLineColor);
    whiteNoteIds.forEach((id, i) => {
        if (id % 12 == 0) {
            var x0 = i * loc.whiteWidth;
            var y0 = loc.yEndOfPiano;
            var y1 = loc.input.sceneHeight;
            loc.input.drawRect(x0, y0, x0 + 1, y1, [id], color, color);
        }
    });
}

export function drawScene(input: Input) {
    var whiteWidth = Math.floor(input.sceneWidth / whiteNoteIds.length);
    var timePerSceneHeigth = input.sceneHeight / input.pixelsPerTime;
    var timeBarHeight = input.sceneHeight * config.p_radius / timePerSceneHeigth;
    var yEndOfTimeBar = Math.floor(config.s_showPiano ? 0.2 * input.sceneHeight : timeBarHeight);
    var loc: Local = {
        input: input,
        whiteWidth: whiteWidth,
        blackWidth: Math.round(0.25 * whiteWidth),
        yEndOfTimeBar: yEndOfTimeBar,
        yEndOfPiano: yEndOfTimeBar - timeBarHeight,
        xRemainder: input.sceneWidth - whiteWidth * whiteNoteIds.length,
    }
    drawCLines(loc);
    drawBarLines(loc);
    iterateNotes(loc, drawWhiteNote);
    iterateNotes(loc, drawBlackNote);
    drawSustainNotes(loc);
    drawTimeBar(loc);
    drawPiano(loc);
    drawNoteCover(loc);
}


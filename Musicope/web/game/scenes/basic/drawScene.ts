/// <reference path="../../_references.ts" />

export interface Input {
  drawRect(x0: number, y0: number, x1: number, y1: number, ids: number[], color: number[], activeColor: number[]): void;
  readOnly: IGame.IParamsData;
  pixelsPerTime: number;
  sceneWidth: number;
  sceneHeight: number;
  tracks: IGame.INoteScene[][];
  p_minNote: number;
  p_maxNote: number;
}

interface Local {
  blackWidth: number;
  yEndOfPiano: number;
  yEndOfTimeBar: number;
  remainder: number;
  whiteWidth: number;
  input: Input;
}

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRgb(hex: string, alpha?: number) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) { return r + r + g + g + b + b; });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [ parseInt(result[1], 16)/255, parseInt(result[2], 16)/255, parseInt(result[3], 16)/255, alpha || 1 ];
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

function drawPianoOutOfReach(loc: Local) {
  var minId = whiteNoteIds.indexOf(loc.input.p_minNote);
  var maxId = whiteNoteIds.indexOf(loc.input.p_maxNote);
  if (minId > -1) {
    var minX1 = minId * loc.whiteWidth;
    var maxX0 = (maxId + 1) * loc.whiteWidth;
    var y1 = loc.yEndOfPiano;
    var color = [0, 0, 0, 0.5];
    loc.input.drawRect(0, 0, minX1, y1, [121], color, color);
  }
}

function drawPianoBlackNotes(loc: Local) {
  blackNoteIds.forEach((id, i) => {
    var x0 = blackNoteSpots[i] * loc.whiteWidth - loc.blackWidth + 2;
    var x1 = x0 + 2 * loc.blackWidth - 3;
    var y0 = Math.floor(loc.yEndOfPiano * 0.4);
    var y1 = loc.yEndOfPiano - 2;
    var activeColor = hexToRgb(loc.input.readOnly.s_colPianoBlack);
    loc.input.drawRect(x0, y0, x1, y1, [id], [0, 0, 0, 1], activeColor);
  });
}

function drawPianoWhiteNotes(loc: Local) {
  whiteNoteIds.forEach((id, i) => {
    var x0 = i * loc.whiteWidth;
    var x1 = x0 + loc.whiteWidth - 1;
    var y0 = 12;
    var y1 = loc.yEndOfPiano - 2;
    loc.input.drawRect(x0, y0, x1, y1, [id], [1, 1, 1, 1], hexToRgb(loc.input.readOnly.s_colPianoWhite));
  });
}

function drawPianoTimeBarColor(loc: Local) {
  var color = hexToRgb(loc.input.readOnly.s_colTime, 0.9);
  var y0 = loc.yEndOfPiano;
  var y1 = loc.yEndOfTimeBar;
  loc.input.drawRect(0, y0, 1, y1, [151, 152, 152, 151], color, color);
}

function drawPianoTimeBarWhite(loc: Local) {
  var y0 = loc.yEndOfPiano;
  var y1 = loc.yEndOfTimeBar;
  var color = [1, 1, 1, 0.9];
  loc.input.drawRect(0, y0, loc.input.sceneWidth, y1, [151], color, color);
}

function drawPianoBackBlack(loc: Local) {
  var y1 = loc.yEndOfPiano;
  loc.input.drawRect(0, 0, loc.input.sceneWidth + 1, y1, [150], [0, 0, 0, 1], [0, 0, 0, 1]);
}

function drawPiano(loc: Local) {
  drawPianoBackBlack(loc);
  drawPianoTimeBarWhite(loc);
  drawPianoTimeBarColor(loc);
  drawPianoWhiteNotes(loc);
  drawPianoBlackNotes(loc);
  drawPianoOutOfReach(loc);
}
    
function drawTrack(loc: Local, trackId: number) {
  var whiteNoteColor = hexToRgb(loc.input.readOnly.s_colWhites[trackId]);
  var blackNoteColor = hexToRgb(loc.input.readOnly.s_colBlacks[trackId]);
  var sustainColor = hexToRgb(loc.input.readOnly.s_colSustain);
  loc.input.tracks[trackId].forEach(function (note) {
    var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 1;
    var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
    var ipos = note.id == -1 ? whiteNoteIds.length : whiteNoteIds.indexOf(note.id);
    if (ipos >= 0) {
      var x0 = ipos * loc.whiteWidth + 3;
      var x1 = x0 + loc.whiteWidth - 5;
      var color = note.id === -1 ? sustainColor : whiteNoteColor;
      loc.input.drawRect(x0, y0, x1, y1, [trackId + 200], color, color);
    } else {
      var pos = blackNoteIds.indexOf(note.id);
      if (pos >= 0) {
        var x0 = blackNoteSpots[pos] * loc.whiteWidth - loc.blackWidth + 2;
        var x1 = x0 + 2 * loc.blackWidth - 3;
        loc.input.drawRect(x0, y0, x1, y1, [trackId + 202], blackNoteColor, blackNoteColor);
      }
    }
  });
}

export function drawScene(input: Input) {
  var whiteWidth = Math.floor(input.sceneWidth / whiteNoteIds.length);
  var loc: Local = {
    input: input,  
    whiteWidth: whiteWidth,    
    blackWidth: Math.round(0.25 * whiteWidth),
    yEndOfTimeBar: Math.floor(0.2 * input.sceneHeight),
    yEndOfPiano: Math.floor(0.18 * input.sceneHeight),
    remainder: input.sceneWidth - whiteWidth * whiteNoteIds.length,
  }
  input.readOnly.s_views.forEach((view, i) => {
    if (view === "full") { drawTrack(loc, i); }
  });
  drawPiano(loc);
}
  

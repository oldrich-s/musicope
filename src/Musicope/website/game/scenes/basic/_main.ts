/// <reference path="../../_references.ts" />

import drawScene = module("./drawScene");
import webgl = module("./webgl");

export class Basic implements IGame.IScene {

  private pixelsPerTime: number;
  private pressedNotes = new Int32Array(127);

  private canvas: HTMLCanvasElement;
  private webgl: webgl.WebGL;

  private pausedColor: Int32Array;
  private unpausedColor: Int32Array;

  constructor(private song: IGame.ISong, public params: IGame.IParams) {
    var o = this;
    o.setBackgrColors();
    o.canvas = o.getCanvas();
    o.setCanvasDim();
    o.setupWebGL();
    o.setupScene();

  }
 
    
  setPressedNote(noteId: number) {
    this.pressedNotes[noteId] = 1;
  }

  unsetPressedNote(noteId: number) {
    this.pressedNotes[noteId] = 0;
  }

  unsetAllPressedNotes() {
    for (var i = 0; i < this.pressedNotes.length; i++) {
      this.pressedNotes[i] = 0;
    }
  }
  
  redraw(time: number, isPaused: bool) {
    var o = this;
    o.setPausedState(isPaused);
    var dx = 2 * time / o.song.timePerSong;
    var dy = -time * o.pixelsPerTime / o.canvas.height * 2;
    o.webgl.redraw(dx, dy, o.pressedNotes);
  }

  private setBackgrColors() {
    var o = this;
    o.pausedColor = new Int32Array(drawScene.hexToRgb(o.params.readOnly.s_colPaused));
    o.unpausedColor = new Int32Array(drawScene.hexToRgb(o.params.readOnly.s_colUnPaused));
  }

  private setPausedState(isPaused: bool) {
    var o = this;
    if (isPaused) {
      o.webgl.setClearColor(o.pausedColor);
    } else {
      o.webgl.setClearColor(o.unpausedColor);
    }
  }

  private getCanvas(): HTMLCanvasElement {
    var c = $("<canvas class='canvas' />").appendTo("body");
    c.css({ position: 'absolute', left: 0, top: 0 });
    return <any> c[0];
  }

  private setCanvasDim() {
    var o = this;
    o.canvas.width = window.innerWidth;
    o.canvas.height = window.innerHeight;
    o.pixelsPerTime = o.canvas.height * 4 / (o.song.noteValuePerBeat * o.params.readOnly.s_quartersPerHeight * o.song.timePerBeat);
    $(window).resize(() => {
      o.canvas.width = window.innerWidth;
      o.canvas.height = window.innerHeight;
    });
  }

  private setupWebGL() {
    var o = this;
    var attributes = [
      { name: "a_position", dim: 2 },
      { name: "a_color", dim: 4 },
      { name: "a_id", dim: 1 },
      { name: "a_activeColor", dim: 4 }
    ];
    o.webgl = new webgl.WebGL(o.canvas, attributes);
  }
      
  private setupScene() {
    var o = this;
    var bag: Float32Array[] = [];
      
    var input: drawScene.Input = {
      drawRect: (x0, y0, x1, y1, ids, color, activeColor) => {
        bag.push(o.rect(x0, y0, x1, y1, ids, [color], [activeColor]));
      },
      readOnly: o.params.readOnly,
      pixelsPerTime: o.pixelsPerTime,
      sceneWidth: o.canvas.width,
      sceneHeight: o.canvas.height,
      tracks: o.song.sceneTracks,
      p_minNote: o.params.readOnly.p_minNote,
      p_maxNote: o.params.readOnly.p_maxNote,
      minPlayedNoteId: o.song.minPlayedNoteId,
      maxPlayedNoteId: o.song.maxPlayedNoteId
    };
    drawScene.drawScene(input);
    var bufferData = Basic.concat(bag);
    o.webgl.setBuffer(bufferData);
  }

  private rect(x0: number, y0: number, x1: number, y1: number, ids: number[], colors: number[][], activeColors: number[][]) {
    var o = this;
    function fx(v: number) { return v / o.canvas.width * 2 - 1; }
    function fy(v: number) { return v / o.canvas.height * 2 - 1; }
    if (colors.length === 1) { colors = [colors[0], colors[0], colors[0], colors[0]]; }
    if (!activeColors) { activeColors = colors; }
    else if (activeColors.length === 1) { activeColors = [activeColors[0], activeColors[0], activeColors[0], activeColors[0]]; }
    if (ids.length === 1) { ids = [ids[0], ids[0], ids[0], ids[0]]; }
    var out = new Float32Array(
      [fx(x0), fy(y0), colors[0][0], colors[0][1], colors[0][2], colors[0][3], ids[0], activeColors[0][0], activeColors[0][1], activeColors[0][2], activeColors[0][3],
        fx(x1), fy(y0), colors[1][0], colors[1][1], colors[1][2], colors[1][3], ids[1], activeColors[1][0], activeColors[1][1], activeColors[1][2], activeColors[1][3],
        fx(x1), fy(y1), colors[2][0], colors[2][1], colors[2][2], colors[2][3], ids[2], activeColors[2][0], activeColors[2][1], activeColors[2][2], activeColors[2][3],
        fx(x0), fy(y0), colors[0][0], colors[0][1], colors[0][2], colors[0][3], ids[0], activeColors[0][0], activeColors[0][1], activeColors[0][2], activeColors[0][3],
        fx(x1), fy(y1), colors[2][0], colors[2][1], colors[2][2], colors[2][3], ids[2], activeColors[2][0], activeColors[2][1], activeColors[2][2], activeColors[2][3],
        fx(x0), fy(y1), colors[3][0], colors[3][1], colors[3][2], colors[3][3], ids[3], activeColors[3][0], activeColors[3][1], activeColors[3][2], activeColors[3][3]]);
    return out;
  }

  static private concat(arrays: Float32Array[]) {
    var result = () => {
      var length = 0;
      arrays.forEach((a) => { length += a.length; });
      return new Float32Array(length);
    } ();
    var pos = 0;
    arrays.forEach((a) => {
      result.set(a, pos);
      pos += a.length;
    });
    return result;
  }

    

}
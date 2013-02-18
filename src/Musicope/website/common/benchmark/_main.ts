/// <reference path="../../_lib/jquery/jquery.d.ts" />

export class Benchmark {

  private displayEvery = 20;
  private dom: IJQuery.JQuery;

  private lastHeapSize = 0;
  private heapSizeId = 0;
  
  private lastFPSTime = 0;
  private id = 0;

  constructor() {
    var o = this;
    o.dom = $("<div />").appendTo("body");
    o.dom.css({
      position: "absolute",
      top: 40,
      left: 0,
      "text-align": "left",
      color: "white",
      "z-index": 100
    });
  }

  display() {
    var o = this;
    if (o.id++ > o.displayEvery) {
      o.id = 0;
      var fps = o.getFPS();
      var heapSize = o.getHeapSize();
      o.dom.html("fps = " + fps + "<br />dHeapSize = " + heapSize);
    }
  }

  private getFPS() {
    var o = this;
    var time = Date.now();
    var fps = o.displayEvery * 1000 / (time - o.lastFPSTime);
    var out = Math.round(100 * fps) / 100;
    o.lastFPSTime = time;
    return out;
  }

  private getHeapSize() {
    var o = this;
    var heapSize = window.performance.memory.usedJSHeapSize;
    var out = Math.round(100 * (heapSize - o.lastHeapSize)) / 100;
    o.lastHeapSize = heapSize;
    return out;
  }

}

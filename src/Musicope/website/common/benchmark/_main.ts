/// <reference path="../../_lib/jquery/jquery.d.ts" />

export class Benchmark {

  private displayEvery = 20;
  private dom: IJQuery.JQuery;

  private lastHeapSize = 0;
  private heapSizeId = 0;
  
  private lastFPSTime = 0;
  private fpsId = 0;

  constructor() {
    var o = this;
    o.dom = $("<div />").appendTo("body");
    o.dom.css({
      position: "absolute",
      top: 0,
      left: 0,
      "text-align": "left",
      color: "white",
      "z-index": 100
    });
  }

  displayHeapSize() {
    var o = this;
    if (o.heapSizeId++ > o.displayEvery) {
      o.heapSizeId = 0;
      var heapSize = window.performance.memory.usedJSHeapSize;
      var str = Math.round(100 * (heapSize - o.lastHeapSize)) / 100;
      o.dom.text("heapSize = " + str);
      o.lastHeapSize = heapSize;
    }
  }

  displayFPS() {
    var o = this;
    if (o.fpsId++ > o.displayEvery) {
      o.fpsId = 0;
      var time = Date.now();
      var fps = o.displayEvery * 1000 / (time - o.lastFPSTime);
      var str = Math.round(100 * fps) / 100;
      o.dom.text("fps = " + str);
      o.lastFPSTime = time;
    }
  }

}

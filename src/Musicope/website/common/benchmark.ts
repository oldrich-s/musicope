module Musicope {

  export class Benchmark {

    private displayEvery = 20;
    private dom: HTMLElement;

    private lastHeapSize = 0;
    private heapSizeId = 0;

    private lastFPSTime = 0;
    private id = 0;

    constructor() {
      var o = this;
      var domjq = $("<div />").appendTo("body");
      domjq.css({
        position: "absolute",
        top: 40,
        left: 0,
        "text-align": "left",
        color: "white",
        "z-index": 100
      });
      o.dom = domjq[0];
    }

    display() {
      var o = this;
      if (o.id++ > o.displayEvery) {
        o.id = 0;
        var fps = o.getFPS();
        var heapSizePerSec = o.getHeapSize() / (o.displayEvery / fps) / 1000;
        var roundedHeapSize = Math.round(100 * heapSizePerSec) / 100;
        o.dom.innerText = "fps = " + fps + ", " + roundedHeapSize + " kB/s";
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
      var heapSize = (<any>window.performance).memory.usedJSHeapSize;
      var out = heapSize - o.lastHeapSize;
      o.lastHeapSize = heapSize;
      return out;
    }

  }

}
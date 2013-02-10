export class Benchmark {

  private lastHeapSize = 0;
  private i = 0;

  constructor() {
  }

  collect() {
    var o = this;
    if (o.i++ > 40) {
      o.i = 0;
      var heapSize = window.performance.memory.usedJSHeapSize;
      console.log(heapSize - o.lastHeapSize);
      o.lastHeapSize = heapSize;
    }
  }


}

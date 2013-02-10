define(["require", "exports"], function(require, exports) {
    var Benchmark = (function () {
        function Benchmark() {
            this.lastHeapSize = 0;
            this.i = 0;
        }
        Benchmark.prototype.collect = function () {
            var o = this;
            if(o.i++ > 40) {
                o.i = 0;
                var heapSize = window.performance.memory.usedJSHeapSize;
                console.log(heapSize - o.lastHeapSize);
                o.lastHeapSize = heapSize;
            }
        };
        return Benchmark;
    })();
    exports.Benchmark = Benchmark;    
})
//@ sourceMappingURL=benchmark.js.map

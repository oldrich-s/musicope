define(["require", "exports"], function(require, exports) {
    /// <reference path="../../_lib/jquery/jquery.d.ts" />
    var Benchmark = (function () {
        function Benchmark() {
            this.displayEvery = 20;
            this.lastHeapSize = 0;
            this.heapSizeId = 0;
            this.lastFPSTime = 0;
            this.id = 0;
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
        Benchmark.prototype.display = function () {
            var o = this;
            if(o.id++ > o.displayEvery) {
                o.id = 0;
                var fps = o.getFPS();
                var heapSizePerSec = o.getHeapSize() / (o.displayEvery / fps) / 1000;
                var roundedHeapSize = Math.round(100 * heapSizePerSec) / 100;
                o.dom.innerText = "fps = " + fps + ", " + roundedHeapSize + " kB/s";
            }
        };
        Benchmark.prototype.getFPS = function () {
            var o = this;
            var time = Date.now();
            var fps = o.displayEvery * 1000 / (time - o.lastFPSTime);
            var out = Math.round(100 * fps) / 100;
            o.lastFPSTime = time;
            return out;
        };
        Benchmark.prototype.getHeapSize = function () {
            var o = this;
            var heapSize = window.performance.memory.usedJSHeapSize;
            var out = heapSize - o.lastHeapSize;
            o.lastHeapSize = heapSize;
            return out;
        };
        return Benchmark;
    })();
    exports.Benchmark = Benchmark;    
})
//@ sourceMappingURL=_main.js.map

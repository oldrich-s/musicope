define(["require", "exports"], function(require, exports) {
    /// <reference path="../_interfaces.ts" />
    var Empty = (function () {
        function Empty() {
        }
        Empty.prototype.inOpen = function (nameOrIndex, callback) {
        };
        Empty.prototype.inClose = function () {
        };
        Empty.prototype.inList = function () {
            return [
                ""
            ];
        };
        Empty.prototype.exists = function () {
            return true;
        };
        Empty.prototype.out = function (byte1, byte2, byte3) {
        };
        Empty.prototype.outClose = function () {
        };
        Empty.prototype.outList = function () {
            return [
                ""
            ];
        };
        Empty.prototype.outOpen = function (name) {
        };
        Empty.prototype.time = function () {
            return Date.now();
        };
        return Empty;
    })();
    exports.Empty = Empty;    
})
//@ sourceMappingURL=_main.js.map

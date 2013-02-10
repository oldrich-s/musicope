define(["require", "exports"], function(require, exports) {
    var jazz;
    var Jazz = (function () {
        function Jazz() {
            var o = this;
            if(!o.exists()) {
                jazz = document.getElementById("Jazz");
            }
            window.onbeforeunload = function () {
                jazz.MidiInClose();
                jazz.MidiOutClose();
            };
        }
        Jazz.prototype.inOpen = function (nameOrIndex, callback) {
            jazz.MidiInOpen(nameOrIndex, callback);
        };
        Jazz.prototype.inClose = function () {
            jazz.MidiInClose();
        };
        Jazz.prototype.inList = function () {
            return jazz.MidiInList();
        };
        Jazz.prototype.exists = function () {
            return jazz && jazz.isJazz;
        };
        Jazz.prototype.out = function (byte1, byte2, byte3) {
            jazz.MidiOut(byte1, byte2, byte3);
        };
        Jazz.prototype.outClose = function () {
            jazz.MidiOutClose();
        };
        Jazz.prototype.outList = function () {
            return jazz.MidiOutList();
        };
        Jazz.prototype.outOpen = function (name) {
            jazz.MidiOutOpen(name);
        };
        Jazz.prototype.time = function () {
            return jazz.Time();
        };
        return Jazz;
    })();
    exports.Jazz = Jazz;    
})
//@ sourceMappingURL=_main.js.map

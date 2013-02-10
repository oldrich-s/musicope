define(["require", "exports", "keyboard/_main", "mouse/_main", "piano/_main"], function(require, exports, __keyboardM__, __mouseM__, __pianoM__) {
    var keyboardM = __keyboardM__;

    exports.Keyboard = keyboardM.Keyboard;
    var mouseM = __mouseM__;

    exports.Mouse = mouseM.Mouse;
    var pianoM = __pianoM__;

    exports.Piano = pianoM.Piano;
})
//@ sourceMappingURL=_load.js.map

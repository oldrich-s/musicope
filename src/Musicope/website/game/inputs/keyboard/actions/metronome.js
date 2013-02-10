define(["require", "exports", "../../../../common/keyCodes", "../overlays/_load"], function(require, exports, __key__, __overlays__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var overlays = __overlays__;

    var Metronome = (function () {
        function Metronome(params, parser) {
            this.params = params;
            this.parser = parser;
            this.hotkeys = [
                key.m
            ];
        }
        Metronome.prototype.keyPressed = function (keyCode) {
            var o = this;
            if(keyCode == key.m) {
                o.toggleMetronome();
            }
        };
        Metronome.prototype.toggleMetronome = function () {
            var o = this;
            o.params.setParam("m_isOn", !o.params.readOnly.m_isOn);
            overlays.basic.display("m_isOn", o.params.readOnly.m_isOn);
        };
        return Metronome;
    })();
    exports.Metronome = Metronome;    
})
//@ sourceMappingURL=metronome.js.map

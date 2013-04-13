define(["require", "exports", "../../../../common/keyCodes"], function(require, exports, __key__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var metronomeOn = (function () {
        function metronomeOn(p) {
            this.p = p;
            this.id = "metronome";
            this.description = "toggle state of the metronome on/off";
            this.key = key.m;
        }
        metronomeOn.prototype.triggerAction = function () {
            var o = this;
            o.p.params.setParam("m_isOn", !o.p.params.readOnly.m_isOn);
        };
        metronomeOn.prototype.getCurrentState = function () {
            var o = this;
            return o.p.params.readOnly.m_isOn ? "on" : "off";
        };
        return metronomeOn;
    })();
    exports.metronomeOn = metronomeOn;    
})
//@ sourceMappingURL=metronomeOn.js.map

define(["require", "exports"], function(require, exports) {
    /// <reference path="../../_references.ts" />
    var Basic = (function () {
        function Basic(timePerBeat, beatsPerBar, device, params) {
            this.timePerBeat = timePerBeat;
            this.beatsPerBar = beatsPerBar;
            this.device = device;
            this.params = params;
            this.lastPlayedId = -10000;
            var o = this;
            o.subscribe();
        }
        Basic.prototype.play = function (time) {
            var o = this;
            if(o.params.readOnly.m_isOn) {
                var id = Math.floor(o.params.readOnly.m_ticksPerBeat * time / o.timePerBeat);
                if(id > o.lastPlayedId) {
                    var noteId = id % o.beatsPerBar == 0 ? o.params.readOnly.m_id1 : o.params.readOnly.m_id2;
                    var velocity = Math.min(127, o.params.readOnly.m_velocity);
                    o.device.out(o.params.readOnly.m_channel, noteId, velocity);
                    o.lastPlayedId = id;
                }
            }
        };
        Basic.prototype.reset = function () {
            this.lastPlayedId = -10000;
        };
        Basic.prototype.subscribe = function () {
            var o = this;
            o.params.subscribe("metronomes.Basic", "^m_.+$", function (name, value) {
                o.reset();
            });
        };
        return Basic;
    })();
    exports.Basic = Basic;    
})
//@ sourceMappingURL=_main.js.map

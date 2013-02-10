define(["require", "exports", "../../../../common/keyCodes", "../overlays/_load"], function(require, exports, __key__, __overlays__) {
    /// <reference path="../../../_references.ts" />
    var key = __key__;

    var overlays = __overlays__;

    var ChangeSpeed = (function () {
        function ChangeSpeed(params, parser) {
            this.params = params;
            this.parser = parser;
            this.hotkeys = [
                key.upArrow, 
                key.downArrow
            ];
            var o = this;
        }
        ChangeSpeed.prototype.keyPressed = function (keyCode) {
            var o = this;
            if(keyCode == key.upArrow) {
                o.speedUp();
            } else if(keyCode == key.downArrow) {
                o.slowDown();
            }
        };
        ChangeSpeed.prototype.speedUp = function () {
            var o = this;
            o.params.setParam("p_speed", o.params.readOnly.p_speed + 0.1);
            overlays.basic.display("p_speed", o.params.readOnly.p_speed);
        };
        ChangeSpeed.prototype.slowDown = function () {
            var o = this;
            o.params.setParam("p_speed", o.params.readOnly.p_speed - 0.1);
            overlays.basic.display("p_speed", o.params.readOnly.p_speed);
        };
        return ChangeSpeed;
    })();
    exports.ChangeSpeed = ChangeSpeed;    
})
//@ sourceMappingURL=changeSpeed.js.map

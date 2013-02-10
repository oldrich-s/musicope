define(["require", "exports", "../../_params/_load", "../../../common/devices/_load", "../../inputs/_load", "../../metronomes/_load", "../../parsers/_load", "../../players/_load", "../../scenes/_load", "./benchmark"], function(require, exports, __paramsM__, __devicesM__, __inputsM__, __metronomesM__, __parsersM__, __playersM__, __scenesM__, __benchmarkM__) {
    /// <reference path="../../_references.ts" />
    var paramsM = __paramsM__;

    var devicesM = __devicesM__;

    var inputsM = __inputsM__;

    var metronomesM = __metronomesM__;

    var parsersM = __parsersM__;

    var playersM = __playersM__;

    var scenesM = __scenesM__;

    var benchmarkM = __benchmarkM__;

    var benchmark = new benchmarkM.Benchmark();
    var Basic = (function () {
        function Basic() {
            this.isEnd = false;
            this.requestAnimationFrame = window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] || window["msRequestAnimationFrame"] || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
            var o = this;
            o.params = new paramsM.Basic();
            if(!o.params.readOnly.c_songUrl) {
                throw "c_songUrl does not exist!";
            } else {
                o.device = new (devicesM[o.params.readOnly.c_idevice])();
                if(!o.device.exists()) {
                    throw "Device does not exist!";
                } else {
                    o.getSong().done(function (arr) {
                        o.init(arr);
                    });
                }
            }
        }
        Basic.prototype.getSong = function () {
            var o = this;
            var out = $.Deferred();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', o.params.readOnly.c_songUrl);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function (e) {
                if(this.status == 200) {
                    var arr = new Uint8Array(xhr.response);
                    out.resolve(arr);
                }
            };
            xhr.send();
            return out;
        };
        Basic.prototype.init = function (arr) {
            var o = this;
            o.parser = new (parsersM[o.params.readOnly.c_iparser])(arr, o.params);
            o.scene = new (scenesM[o.params.readOnly.c_iscene])(o.parser, o.params);
            o.metronome = new metronomesM.Basic(o.parser.timePerBeat, o.parser.timePerBar / o.parser.timePerBeat, o.device, o.params);
            o.player = new (playersM[o.params.readOnly.c_iplayer])(o.device, o.parser, o.metronome, o.scene, o.params);
            for(var prop in inputsM) {
                new (inputsM[prop])(o.params, o.parser);
            }
            o.step();
        };
        Basic.prototype.step = function () {
            var o = this;
            function _step() {
                if(!o.isEnd) {
                    //window["webkitRequestAnimationFrame"](_step);
                    o.requestAnimationFrame.call(window, _step);
                }
                o.isEnd = o.player.step();
                if(o.isEnd) {
                    o.redirect();
                }
            }
            _step();
        };
        Basic.prototype.redirect = function () {
            var o = this;
            if(o.params.readOnly.c_callbackUrl) {
                window.location.href = o.params.readOnly.c_callbackUrl;
            }
        };
        return Basic;
    })();
    exports.Basic = Basic;    
})
//@ sourceMappingURL=_main.js.map

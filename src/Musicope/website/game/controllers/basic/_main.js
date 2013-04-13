define(["require", "exports", "../../_params/_load", "../../../common/devices/_load", "../../inputs/_load", "../../metronomes/_load", "../../songs/_load", "../../players/_load", "../../scenes/_load"], function(require, exports, __paramsM__, __devicesM__, __inputsM__, __metronomesM__, __songsM__, __playersM__, __scenesM__) {
    /// <reference path="../../_references.ts" />
    var paramsM = __paramsM__;

    var devicesM = __devicesM__;

    var inputsM = __inputsM__;

    var metronomesM = __metronomesM__;

    var songsM = __songsM__;

    var playersM = __playersM__;

    var scenesM = __scenesM__;

    //import benchmarkM = module("../../../common/benchmark/_main");
    //var benchmark = new benchmarkM.Benchmark();
    var Basic = (function () {
        function Basic() {
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
            var isLocal = o.params.readOnly.c_songUrl.indexOf("../") == 0;
            if(isLocal) {
                return o.getSongLocal();
            } else {
                return o.getSongRemote();
            }
        };
        Basic.prototype.getSongLocal = function () {
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
            return out.promise();
        };
        Basic.prototype.getSongRemote = function () {
            var o = this;
            var out = $.Deferred();
            var url = "../proxy.php?url=" + encodeURIComponent(o.params.readOnly.c_songUrl);
            $.get(url).done(function (text) {
                var arr = atob(text);
                out.resolve(arr);
            });
            return out;
        };
        Basic.prototype.init = function (arr) {
            var o = this;
            o.song = new (songsM[o.params.readOnly.c_iparser])(arr, o.params);
            o.scene = new (scenesM[o.params.readOnly.c_iscene])(o.song, o.params);
            o.metronome = new metronomesM.Basic(o.song.timePerBeat, o.song.timePerBar / o.song.timePerBeat, o.device, o.params);
            o.player = new (playersM[o.params.readOnly.c_iplayer])(o.device, o.song, o.metronome, o.scene, o.params);
            for(var prop in inputsM) {
                new (inputsM[prop])(o.params, o.song);
            }
            o.step();
        };
        Basic.prototype.step = function () {
            var o = this;
            var isEnd = false;
            function _step() {
                if(o.params.readOnly.c_callbackUrl && isEnd) {
                    o.redirect();
                } else {
                    o.requestAnimationFrame.call(window, _step);
                    isEnd = o.player.step();
                }
            }
            _step();
        };
        Basic.prototype.redirect = function () {
            var o = this;
            window.location.href = o.params.readOnly.c_callbackUrl;
        };
        return Basic;
    })();
    exports.Basic = Basic;    
})
//@ sourceMappingURL=_main.js.map

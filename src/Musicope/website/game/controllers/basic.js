var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Controllers) {
            var Basic = (function () {
                function Basic() {
                    this.requestAnimationFrame = window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] || window["msRequestAnimationFrame"] || function (callback) {
                        window.setTimeout(callback, 1000 / 60);
                    };
                    var o = this;

                    o.params = new Musicope.Game.Params.Basic();

                    if (!o.params.readOnly.c_songUrl) {
                        throw "c_songUrl does not exist!";
                    } else {
                        o.device = new Musicope.Devices[o.params.readOnly.c_idevice]();
                        if (!o.device.exists()) {
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
                    if (isLocal) {
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
                        if (this.status == 200) {
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
                    o.song = new Musicope.Game.Songs[o.params.readOnly.c_iparser](arr, o.params);
                    o.scene = new Musicope.Game.Scenes[o.params.readOnly.c_iscene](o.song, o.params);
                    o.metronome = new Musicope.Game.Metronomes.Basic(o.song.timePerBeat, o.song.timePerBar / o.song.timePerBeat, o.device, o.params);
                    o.player = new Musicope.Game.Players[o.params.readOnly.c_iplayer](o.device, o.song, o.metronome, o.scene, o.params);
                    for (var prop in inputsM) {
                        new Musicope.Game.Inputs[prop](o.params, o.song);
                    }
                    o.step();
                };

                Basic.prototype.step = function () {
                    var o = this;
                    var isEnd = false;
                    function _step() {
                        if (o.params.readOnly.c_callbackUrl && isEnd) {
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
            Controllers.Basic = Basic;
        })(Game.Controllers || (Game.Controllers = {}));
        var Controllers = Game.Controllers;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=basic.js.map

var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Players) {
            (function (BasicFns) {
                var o;

                var FromDevice = (function () {
                    function FromDevice(device, scene, params, notes) {
                        this.device = device;
                        this.scene = scene;
                        this.params = params;
                        this.notes = notes;
                        this.noteOnFuncs = [];
                        this.oldTimeStamp = -1;
                        this.oldVelocity = -1;
                        this.oldId = -1;
                        o = this;
                        o.initDevice();
                    }
                    FromDevice.prototype.initDevice = function () {
                        var midiOut = o.params.readOnly.p_deviceOut;
                        var midiIn = o.params.readOnly.p_deviceIn;
                        o.device.outOpen(midiOut);
                        o.device.out(0x80, 0, 0);
                        o.device.inOpen(midiIn, o.deviceIn);
                    };

                    FromDevice.prototype.onNoteOn = function (func) {
                        o.noteOnFuncs.push(func);
                    };

                    FromDevice.prototype.deviceIn = function (timeStamp, kind, noteId, velocity) {
                        o.sendBackToDevice(kind, noteId, velocity);
                        var isNoteOn = kind === 144 && velocity > 0;
                        var isNoteOff = kind === 128 || (kind === 144 && velocity == 0);
                        if (isNoteOn && !o.isDoubleNote(timeStamp, isNoteOn, noteId, velocity)) {
                            console.log(timeStamp + " " + kind + " " + noteId + " " + velocity);
                            o.scene.setActiveId(noteId);
                            o.execNoteOnFuncs(noteId);
                        } else if (isNoteOff) {
                            o.scene.unsetActiveId(noteId);
                        }
                    };

                    FromDevice.prototype.sendBackToDevice = function (kind, noteId, velocity) {
                        if (kind < 242 && (kind < 127 || kind > 160)) {
                            o.device.out(kind, noteId, velocity);
                        }
                    };

                    FromDevice.prototype.isDoubleNote = function (timeStamp, isNoteOn, noteId, velocity) {
                        var isSimilarTime = Math.abs(timeStamp - o.oldTimeStamp) < 3;
                        var idMaches = Math.abs(noteId - o.oldId) == 12 || Math.abs(noteId - o.oldId) == 24;
                        var isDoubleNote = isSimilarTime && idMaches && velocity == o.oldVelocity;
                        o.oldTimeStamp = timeStamp;
                        o.oldVelocity = velocity;
                        o.oldId = noteId;
                        return isDoubleNote;
                    };

                    FromDevice.prototype.execNoteOnFuncs = function (noteId) {
                        for (var i = 0; i < o.noteOnFuncs.length; i++) {
                            o.noteOnFuncs[i](noteId);
                        }
                    };
                    return FromDevice;
                })();
                BasicFns.FromDevice = FromDevice;
            })(Players.BasicFns || (Players.BasicFns = {}));
            var BasicFns = Players.BasicFns;
        })(Game.Players || (Game.Players = {}));
        var Players = Game.Players;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
//# sourceMappingURL=fromDevice.js.map

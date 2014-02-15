var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var CoverNotes = (function () {
                            function CoverNotes(p) {
                                this.p = p;
                                this.id = "cover notes";
                                this.description = "Cover notes";
                                this.key = "c";
                                this.states = [0.0, 0.2, 0.4, 0.6, 0.8];
                            }
                            CoverNotes.prototype.triggerAction = function () {
                                var o = this;
                                var height = Musicope.Game.Inputs.KeyboardFns.Actions.Tools.toggle(o.p.params.readOnly.s_noteCoverRelHeight, o.states);
                                o.p.params.setParam("s_noteCoverRelHeight", height);
                            };

                            CoverNotes.prototype.getCurrentState = function () {
                                var o = this;
                                return o.p.params.readOnly.s_noteCoverRelHeight;
                            };
                            return CoverNotes;
                        })();
                        List.CoverNotes = CoverNotes;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (PlayerFns) {
            var FromDevice = (function () {
                function FromDevice(device, scene, params, notes) {
                    var _this = this;
                    this.device = device;
                    this.scene = scene;
                    this.params = params;
                    this.notes = notes;
                    this.noteOnFuncs = [];
                    this.oldTimeStamp = -1;
                    this.oldVelocity = -1;
                    this.oldId = -1;
                    this.initDevice = function () {
                        var o = _this;
                        var midiOut = o.params.readOnly.p_deviceOut;
                        var midiIn = o.params.readOnly.p_deviceIn;
                        o.device.outOpen(midiOut);
                        o.device.out(0x80, 0, 0);
                        o.device.inOpen(midiIn, o.deviceIn);
                    };
                    this.onNoteOn = function (func) {
                        var o = _this;
                        o.noteOnFuncs.push(func);
                    };
                    this.deviceIn = function (timeStamp, kind, noteId, velocity) {
                        var o = _this;
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
                    this.sendBackToDevice = function (kind, noteId, velocity) {
                        var o = _this;
                        if (kind < 242 && (kind < 127 || kind > 160)) {
                            o.device.out(kind, noteId, velocity);
                        }
                    };
                    this.isDoubleNote = function (timeStamp, isNoteOn, noteId, velocity) {
                        var o = _this;
                        var isSimilarTime = Math.abs(timeStamp - o.oldTimeStamp) < 3;
                        var idMaches = Math.abs(noteId - o.oldId) == 12 || Math.abs(noteId - o.oldId) == 24;
                        var isDoubleNote = isSimilarTime && idMaches && velocity == o.oldVelocity;
                        o.oldTimeStamp = timeStamp;
                        o.oldVelocity = velocity;
                        o.oldId = noteId;
                        return isDoubleNote;
                    };
                    this.execNoteOnFuncs = function (noteId) {
                        var o = _this;
                        for (var i = 0; i < o.noteOnFuncs.length; i++) {
                            o.noteOnFuncs[i](noteId);
                        }
                    };
                    var o = this;
                    o.initDevice();
                }
                return FromDevice;
            })();
            PlayerFns.FromDevice = FromDevice;
        })(Game.PlayerFns || (Game.PlayerFns = {}));
        var PlayerFns = Game.PlayerFns;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (PlayerFns) {
            var PlayNotes = (function () {
                function PlayNotes(device, scene, params, notes) {
                    var _this = this;
                    this.device = device;
                    this.scene = scene;
                    this.params = params;
                    this.notes = notes;
                    this.play = function () {
                        var o = _this;
                        for (var trackId = 0; trackId < o.notes.length; trackId++) {
                            while (o.isIdBelowCurrentTime(trackId)) {
                                var note = o.notes[trackId][o.ids[trackId]];
                                o.playNote(note, trackId);
                                o.ids[trackId]++;
                            }
                        }
                    };
                    this.reset = function (idsBelowCurrentTime) {
                        var o = _this;
                        for (var i = 0; i < idsBelowCurrentTime.length; i++) {
                            o.ids[i] = Math.max(0, idsBelowCurrentTime[i]);
                        }
                    };
                    this.assignIds = function () {
                        var o = _this;
                        o.ids = o.notes.map(function () {
                            return 0;
                        });
                    };
                    this.isIdBelowCurrentTime = function (trackId) {
                        var o = _this;
                        return o.notes[trackId][o.ids[trackId]] && o.notes[trackId][o.ids[trackId]].time < o.params.readOnly.p_elapsedTime;
                    };
                    this.playNote = function (note, trackId) {
                        var o = _this;
                        var playsUser = o.params.readOnly.p_userHands[trackId];
                        if (!playsUser || o.playOutOfReach(note)) {
                            if (note.on) {
                                o.device.out(144, note.id, Math.min(127, o.getVelocity(trackId, note)));
                                o.scene.setActiveId(note.id);
                            } else {
                                o.device.out(144, note.id, 0);
                                o.scene.unsetActiveId(note.id);
                            }
                        }
                    };
                    this.playOutOfReach = function (note) {
                        var o = _this;
                        var isBelowMin = note.id < o.params.readOnly.p_minNote;
                        var isAboveMax = note.id > o.params.readOnly.p_maxNote;
                        o.params.readOnly.p_playOutOfReachNotes && (isBelowMin || isAboveMax);
                    };
                    this.getVelocity = function (trackId, note) {
                        var o = _this;
                        var velocity = o.params.readOnly.p_volumes[trackId] * note.velocity;
                        var maxVelocity = o.params.readOnly.p_maxVelocity[trackId];
                        if (maxVelocity && velocity > maxVelocity) {
                            velocity = maxVelocity;
                        }
                        return velocity;
                    };
                    var o = this;
                    o = this;
                    o.assignIds();
                }
                return PlayNotes;
            })();
            PlayerFns.PlayNotes = PlayNotes;
        })(Game.PlayerFns || (Game.PlayerFns = {}));
        var PlayerFns = Game.PlayerFns;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (PlayerFns) {
            var PlaySustains = (function () {
                function PlaySustains(device, params, sustainNotes) {
                    var _this = this;
                    this.device = device;
                    this.params = params;
                    this.sustainNotes = sustainNotes;
                    this.id = 0;
                    this.play = function () {
                        var o = _this;
                        while (o.isIdBelowCurrentTime()) {
                            o.playSustainNote(o.sustainNotes[o.id]);
                            o.id++;
                        }
                    };
                    this.isIdBelowCurrentTime = function () {
                        var o = _this;
                        return o.sustainNotes[o.id] && o.sustainNotes[o.id].time < o.params.readOnly.p_elapsedTime;
                    };
                    this.playSustainNote = function (note) {
                        var o = _this;
                        if (o.params.readOnly.p_sustain) {
                            if (note.on) {
                                o.device.out(176, 64, 127);
                            } else {
                                o.device.out(176, 64, 0);
                            }
                        }
                    };
                    var o = this;
                }
                return PlaySustains;
            })();
            PlayerFns.PlaySustains = PlaySustains;
        })(Game.PlayerFns || (Game.PlayerFns = {}));
        var PlayerFns = Game.PlayerFns;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (PlayerFns) {
            var WaitForNote = (function () {
                function WaitForNote(device, params, notes, onNoteOn) {
                    var _this = this;
                    this.device = device;
                    this.params = params;
                    this.notes = notes;
                    this.onNoteOn = onNoteOn;
                    this.isFreeze = function () {
                        var o = _this;
                        var freeze = false;
                        for (var trackId = 0; trackId < o.notes.length; trackId++) {
                            var isWait = o.params.readOnly.p_userHands[trackId] && o.params.readOnly.p_waits[trackId];
                            if (isWait) {
                                while (!freeze && o.isIdBelowCurrentTimeMinusRadius(trackId, o.ids[trackId])) {
                                    freeze = o.isNoteUnpressed(trackId, o.ids[trackId]);
                                    if (!freeze) {
                                        o.ids[trackId]++;
                                    }
                                    ;
                                }
                            }
                        }
                        return freeze;
                    };
                    this.reset = function (idsBelowCurrentTime) {
                        var o = _this;
                        o.resetNotesPressedTime(idsBelowCurrentTime);
                        idsBelowCurrentTime.forEach(o.setId);
                    };
                    this.assignIds = function () {
                        var o = _this;
                        o.ids = o.notes.map(function () {
                            return 0;
                        });
                    };
                    this.assignNotesPressedTime = function () {
                        var o = _this;
                        o.notesPressedTime = o.notes.map(function (notesi) {
                            var arr = [];
                            arr[notesi.length - 1] = undefined;
                            return arr;
                        });
                    };
                    this.addNoteOnToKnownNotes = function (noteId) {
                        var o = _this;
                        for (var i = 0; i < o.params.readOnly.p_userHands.length; i++) {
                            if (o.params.readOnly.p_userHands[i]) {
                                var id = o.ids[i];
                                while (o.isIdBelowCurrentTimePlusRadius(i, id)) {
                                    var note = o.notes[i][id];
                                    if (note.on && !o.notesPressedTime[i][id] && note.id === noteId) {
                                        var radius = Math.abs(o.notes[i][id].time - o.params.readOnly.p_elapsedTime) - 50;
                                        if (radius < o.params.readOnly.p_radiuses[i]) {
                                            o.notesPressedTime[i][id] = o.params.readOnly.p_elapsedTime;
                                            return;
                                        }
                                    }
                                    id++;
                                }
                            }
                        }
                    };
                    this.isIdBelowCurrentTimePlusRadius = function (trackId, noteId) {
                        var o = _this;
                        return o.notes[trackId][noteId] && o.notes[trackId][noteId].time < o.params.readOnly.p_elapsedTime + o.params.readOnly.p_radiuses[trackId];
                    };
                    this.resetNotesPressedTime = function (idsBelowCurrentTime) {
                        var o = _this;
                        for (var i = 0; i < idsBelowCurrentTime.length; i++) {
                            for (var j = idsBelowCurrentTime[i] + 1; j < o.notesPressedTime[i].length; j++) {
                                if (o.notesPressedTime[i][j]) {
                                    o.notesPressedTime[i][j] = undefined;
                                }
                            }
                        }
                    };
                    this.setId = function (id, i) {
                        var o = _this;
                        o.ids[i] = id + 1;
                    };
                    this.isIdBelowCurrentTimeMinusRadius = function (trackId, noteId) {
                        var o = _this;
                        return o.notes[trackId][noteId] && o.notes[trackId][noteId].time < o.params.readOnly.p_elapsedTime - o.params.readOnly.p_radiuses[trackId];
                    };
                    this.isNoteUnpressed = function (trackId, noteId) {
                        var o = _this;
                        var note = o.notes[trackId][noteId];
                        var wasPlayedByUser = o.notesPressedTime[trackId][noteId];
                        var waitForOutOfReach = true;
                        if (!o.params.readOnly.p_waitForOutOfReachNotes) {
                            var isNoteAboveMin = note.id >= o.params.readOnly.p_minNote;
                            var isNoteBelowMax = note.id <= o.params.readOnly.p_maxNote;
                            waitForOutOfReach = isNoteAboveMin && isNoteBelowMax;
                        }
                        return note.on && !wasPlayedByUser && waitForOutOfReach;
                    };
                    var o = this;
                    o.assignIds();
                    o.assignNotesPressedTime();
                    onNoteOn(o.addNoteOnToKnownNotes);
                }
                return WaitForNote;
            })();
            PlayerFns.WaitForNote = WaitForNote;
        })(Game.PlayerFns || (Game.PlayerFns = {}));
        var PlayerFns = Game.PlayerFns;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Parsers) {
            (function (Midi) {
                (function (MidiToJson) {
                    function readVariableLength(arr, i) {
                        var value = arr[i++];
                        if (value & 0x80) {
                            value = value & 0x7F;
                            do {
                                var c = arr[i++];
                                value = (value << 7) + (c & 0x7F);
                            } while(c & 0x80);
                        }
                        return { value: value, newi: i };
                    }

                    function getChunkSize(arr) {
                        return 256 * 256 * 256 * arr[0] + 256 * 256 * arr[1] + 256 * arr[2] + arr[3];
                    }

                    function parseTrackEvent(arr, i) {
                        var ob = readVariableLength(arr, i);
                        var dTime = ob.value;
                        i = ob.newi;
                        var eventType = arr[i];
                        switch (eventType) {
                            case 240:
                            case 247:
                                var ob = readVariableLength(arr, i + 1);
                                return {
                                    type: "sysEx",
                                    dTime: dTime,
                                    value: arr.subarray(ob.newi, ob.newi + ob.value),
                                    newi: ob.newi + ob.value
                                };
                            case 255:
                                var metaType = arr[i + 1];
                                var ob = readVariableLength(arr, i + 2);
                                var subarray = arr.subarray(ob.newi, ob.newi + ob.value);
                                var event = Musicope.Game.Parsers.Midi.MetaEvent.parse(metaType, subarray);
                                return {
                                    type: "meta",
                                    dTime: dTime,
                                    value: event,
                                    newi: ob.newi + ob.value
                                };
                            default:
                                return Musicope.Game.Parsers.Midi.MidiEvent.parse(dTime, arr, i);
                        }
                    }

                    function parseTrackChunk(arr) {
                        var events = [];
                        var i = 0;
                        while (i < arr.length) {
                            var res = parseTrackEvent(arr, i);
                            events.push({ type: res.type, dTime: res.dTime, value: res.value });
                            i = res.newi;
                        }
                        return {
                            type: "track",
                            value: events
                        };
                    }

                    function isTrackChunk(arr) {
                        return arr[0] == 77 && arr[1] == 84 && arr[2] == 114 && arr[3] == 107;
                    }

                    function parseHeaderChunk(arr) {
                        var ticksPerQuarter = arr[4] * 256 + arr[5];
                        if (ticksPerQuarter & 0x8000) {
                            throw "frames per second not implemented";
                        } else {
                            return {
                                type: "header",
                                value: {
                                    format: 256 * arr[0] + arr[1],
                                    numberOfTracks: 256 * arr[2] + arr[3],
                                    ticksPerQuarter: ticksPerQuarter
                                }
                            };
                        }
                    }

                    function isHeaderChunk(arr) {
                        return arr[0] == 77 && arr[1] == 84 && arr[2] == 104 && arr[3] == 100;
                    }

                    function getChunkParser(arr) {
                        if (isHeaderChunk(arr)) {
                            return parseHeaderChunk;
                        } else if (isTrackChunk(arr)) {
                            return parseTrackChunk;
                        } else {
                            throw "unknown chunk";
                        }
                    }

                    function parse(arr) {
                        var chunks = [];
                        var i = 0;
                        while (i < arr.length) {
                            var chunkParser = getChunkParser(arr.subarray(i, i + 4));
                            var chunkSize = getChunkSize(arr.subarray(i + 4, i + 8));
                            var chunkBegin = i + 8;
                            var chunkEnd = chunkBegin + chunkSize;
                            var chunk = arr.subarray(chunkBegin, chunkEnd);
                            chunks.push(chunkParser(chunk));
                            i = chunkEnd;
                        }
                        return chunks;
                    }
                    MidiToJson.parse = parse;
                })(Midi.MidiToJson || (Midi.MidiToJson = {}));
                var MidiToJson = Midi.MidiToJson;
            })(Parsers.Midi || (Parsers.Midi = {}));
            var Midi = Parsers.Midi;
        })(Game.Parsers || (Game.Parsers = {}));
        var Parsers = Game.Parsers;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Parsers) {
            (function (Midi) {
                (function (MetaEvent) {
                    function sequencerSpecific(arr) {
                        return arr;
                    }

                    function keySignature(arr) {
                        return { key: arr[0], scale: arr[1] };
                    }

                    function timeSignature(arr) {
                        return { numer: arr[0], denom: arr[1], metro: arr[2], nds32: arr[3] };
                    }

                    function smpteOffset(arr) {
                        return { hour: arr[0], min: arr[1], sec: arr[2], fr: arr[3], subfr: arr[4] };
                    }

                    function setTempo(arr) {
                        return 256 * 256 * arr[0] + 256 * arr[1] + arr[2];
                    }

                    function endOfTrack(arr) {
                        return true;
                    }

                    function midiChannelPrefix(arr) {
                        return arr[0];
                    }

                    function toText(arr) {
                        var text = "";
                        for (var i = 0; i < arr.byteLength; i++) {
                            text += String.fromCharCode(arr[i]);
                        }
                        return text;
                    }

                    function sequenceNumber(arr) {
                        return {
                            MSB: arr[0],
                            LSB: arr[1]
                        };
                    }

                    var metaTypes = {
                        0: { type: "sequenceNumber", fn: sequenceNumber },
                        1: { type: "text", fn: toText },
                        2: { type: "copyrightNotice", fn: toText },
                        3: { type: "sequenceOrTrackName", fn: toText },
                        4: { type: "InstrumentName", fn: toText },
                        5: { type: "lyrics", fn: toText },
                        6: { type: "marker", fn: toText },
                        7: { type: "cuePoint", fn: toText },
                        32: { type: "midiChannelPrefix", fn: midiChannelPrefix },
                        47: { type: "endOfTrack", fn: endOfTrack },
                        81: { type: "setTempo", fn: setTempo },
                        84: { type: "smpteOffset", fn: smpteOffset },
                        88: { type: "timeSignature", fn: timeSignature },
                        89: { type: "keySignature", fn: keySignature },
                        127: { type: "sequencerSpecific", fn: sequencerSpecific }
                    };

                    function parse(metaType, arr) {
                        var event = metaTypes[metaType];
                        return {
                            type: event["type"],
                            value: event["fn"](arr)
                        };
                    }
                    MetaEvent.parse = parse;
                })(Midi.MetaEvent || (Midi.MetaEvent = {}));
                var MetaEvent = Midi.MetaEvent;
            })(Parsers.Midi || (Parsers.Midi = {}));
            var Midi = Parsers.Midi;
        })(Game.Parsers || (Game.Parsers = {}));
        var Parsers = Game.Parsers;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Parsers) {
            (function (Midi) {
                (function (MidiEvent) {
                    var oldTypeChannel;

                    var types = {
                        8: { type: "noteOff", v1: "note", v2: "velocity" },
                        9: { type: "noteOn", v1: "note", v2: "velocity" },
                        10: { type: "noteAftertouch", v1: "note", v2: "amount" },
                        11: { type: "controller", v1: "type", v2: "value" },
                        12: { type: "programChange", v1: "number" },
                        13: { type: "channelAftertouch", v1: "amount" },
                        14: { type: "pitchBend", v1: "lsb", v2: "msb" }
                    };

                    function getValue(ob, channel, repeating, arr, i) {
                        var value = {};
                        value["type"] = ob["type"];
                        value["channel"] = channel;
                        value[ob["v1"]] = repeating ? arr[i] : arr[i + 1];
                        if (ob["v2"]) {
                            value[ob["v2"]] = repeating ? arr[i + 1] : arr[i + 2];
                        }
                        return value;
                    }

                    function parse(dTime, arr, i) {
                        var repeating = arr[i] >> 4 < 8 || arr[i] >> 4 > 14;
                        var typeChannel = repeating ? oldTypeChannel : arr[i];
                        var type = typeChannel >> 4;
                        var channel = typeChannel - type * 16;
                        if (!repeating) {
                            oldTypeChannel = arr[i];
                        }
                        var ob = types[type];
                        return {
                            type: "midi",
                            dTime: dTime,
                            value: getValue(ob, channel, repeating, arr, i),
                            newi: i + (repeating ? 2 : 3) + (ob["v2"] ? 0 : -1)
                        };
                    }
                    MidiEvent.parse = parse;
                })(Midi.MidiEvent || (Midi.MidiEvent = {}));
                var MidiEvent = Midi.MidiEvent;
            })(Parsers.Midi || (Parsers.Midi = {}));
            var Midi = Parsers.Midi;
        })(Game.Parsers || (Game.Parsers = {}));
        var Parsers = Game.Parsers;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Parsers) {
            (function (Midi) {
                function parseNoteOff(time, midi) {
                    return {
                        time: time,
                        on: false,
                        id: midi["note"],
                        velocity: midi["velocity"]
                    };
                }

                function parseNoteOn(time, midi) {
                    return {
                        time: time,
                        on: midi["velocity"] > 0,
                        id: midi["note"],
                        velocity: midi["velocity"]
                    };
                }

                function parseMidiEvent(time, midi) {
                    if (midi["type"] == "noteOn") {
                        return parseNoteOn(time, midi);
                    } else if (midi["type"] == "noteOff") {
                        return parseNoteOff(time, midi);
                    }
                }

                function parseChunk(chunk) {
                    var time = 0;
                    var result = chunk["value"].map(function (event) {
                        time = time + event["dTime"];
                        if (event["type"] == "midi") {
                            return parseMidiEvent(time, event["value"]);
                        }
                    });
                    return result.filter(function (v) {
                        return v;
                    });
                }

                function getNotes(chunks) {
                    var result = chunks.map(function (chunk) {
                        if (chunk["type"] == "track") {
                            return parseChunk(chunk);
                        }
                    });
                    return result.filter(function (v) {
                        return v;
                    });
                }

                var Midi2 = (function () {
                    function Midi2(midi) {
                        this.midi = midi;
                        this.tracks = [];
                        this.sustainNotes = [];
                        var o = this;
                        var json = Musicope.Game.Parsers.Midi.MidiToJson.parse(midi);
                        o.tracks = getNotes(json);
                    }
                    return Midi2;
                })();
                Midi.Midi2 = Midi2;
            })(Parsers.Midi || (Parsers.Midi = {}));
            var Midi = Parsers.Midi;
        })(Game.Parsers || (Game.Parsers = {}));
        var Parsers = Game.Parsers;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Parsers) {
            (function (_Midi) {
                var Midi = (function () {
                    function Midi(midi) {
                        this.midi = midi;
                        this.noteValuePerBeat = 4;
                        this.tracks = [];
                        this.sustainNotes = [];
                        this.beatsPerBar = 4;
                        this.lastVals = [undefined, undefined, undefined, undefined];
                        var o = this;

                        //var t = new mm.Midi2(midi);
                        o.parseHeader();
                        o.parsePlayerTracks();
                    }
                    Midi.prototype.parseHeader = function () {
                        var o = this;
                        var i0 = Midi.indexOf(o.midi, [77, 84, 104, 100, 0, 0, 0, 6]);
                        if (i0 == -1 || o.midi[i0 + 9] > 1) {
                            alert("cannot parse midi");
                        }

                        o.ticksPerQuarter = o.midi[i0 + 12] * 256 + o.midi[i0 + 13];
                        if (o.ticksPerQuarter & 0x8000) {
                            alert("ticksPerBeat not implemented");
                        }
                    };

                    Midi.prototype.parsePlayerTracks = function () {
                        var o = this;
                        var trackIndexes = Midi.indexesOf(o.midi, [77, 84, 114, 107]);
                        trackIndexes.forEach(function (index, i) {
                            o.parsePlayerTrack(i, index + 4);
                        });
                        if (o.tracks[0].length == 0) {
                            o.tracks.shift();
                        }
                    };

                    Midi.prototype.parsePlayerTrack = function (trackId, index) {
                        var o = this, ticks = 0;
                        o.tracks.push([]);
                        var trackLength = o.midi[index++] * 256 * 256 * 256 + o.midi[index++] * 256 * 256 + o.midi[index++] * 256 + o.midi[index++];
                        var end = index + trackLength;
                        while (index < end) {
                            var ob = o.readVarLength(index);
                            index = ob.newIndex, ticks = ticks + ob.value;
                            var typeChannel = o.midi[index++];

                            if (typeChannel === 240) {
                                var ob1 = o.readVarLength(index);
                                index = ob1.newIndex + ob1.value;
                            } else if (typeChannel === 255) {
                                index = o.processMeta(index, trackId == 0 && ticks == 0);
                            } else {
                                var time = ticks * o.timePerTick;
                                index = o.processMessage(trackId, index, typeChannel, time);
                            }
                        }
                        if (trackId == 0) {
                            o.timePerBeat = o.timePerQuarter * 4 / o.noteValuePerBeat;
                            o.timePerTick = o.timePerQuarter / o.ticksPerQuarter;
                            o.timePerBar = o.timePerBeat * o.beatsPerBar;
                        }
                    };

                    Midi.prototype.processMeta = function (index, isBegining) {
                        var o = this;
                        var type = o.midi[index++];
                        var ob = o.readVarLength(index);
                        index = ob.newIndex;
                        switch (type) {
                            case 81:
                                if (isBegining) {
                                    o.timePerQuarter = (256 * 256 * o.midi[index] + 256 * o.midi[index + 1] + o.midi[index + 2]) / 1000;
                                }
                                break;
                            case 88:
                                if (isBegining) {
                                    o.beatsPerBar = o.midi[index];
                                    o.noteValuePerBeat = Math.pow(2, o.midi[index + 1]);
                                    var midiClocksPerMetronomeClick = o.midi[index + 2];
                                    var thirtySecondsPer24Clocks = o.midi[index + 3];
                                }
                                break;
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 32:
                            case 33:
                            case 47:
                            case 84:
                            case 89:
                            case 127:
                            default:
                                break;
                        }
                        return index + ob.value;
                    };

                    Midi.prototype.processMessage = function (trackId, index, typeChannel, time) {
                        var o = this;

                        if (typeChannel >> 4 > 7 && typeChannel >> 4 < 15) {
                            o.lastVals[trackId] = typeChannel;
                        } else if (o.lastVals[trackId]) {
                            typeChannel = o.lastVals[trackId];
                            index--;
                        }

                        var type = typeChannel >> 4;
                        var channel = typeChannel - type * 16;

                        switch (type) {
                            case 8:
                            case 9:
                                var noteId = o.midi[index++];
                                var velocity = o.midi[index++];
                                var on = type == 9 && velocity > 0;
                                o.tracks[trackId].push({ on: on, time: time, id: noteId, velocity: velocity });
                                break;
                            case 10:
                                index = index + 2;
                                break;
                            case 11:
                                var id = o.midi[index++];
                                var value = o.midi[index++];
                                if (id == 64) {
                                    o.sustainNotes.push({ on: value > 63, time: time });
                                }
                                break;
                            case 12:
                                index = index + 1;
                                break;
                            case 13:
                                index = index + 1;
                                break;
                            case 14:
                                index = index + 2;
                                break;
                            default:
                                alert("Event not implemented");
                                break;
                        }
                        return index;
                    };

                    Midi.prototype.readVarLength = function (index) {
                        var value = this.midi[index++];
                        if (value & 0x80) {
                            value = value & 0x7F;
                            do {
                                var c = this.midi[index++];
                                value = (value << 7) + (c & 0x7F);
                            } while(c & 0x80);
                        }
                        return { value: value, newIndex: index };
                    };

                    Midi.indexOf = function (where, what) {
                        for (var i = 0; i < where.length; i++) {
                            var found = what.every(function (whati, j) {
                                return whati == where[i + j];
                            });
                            if (found) {
                                return i;
                            }
                        }
                        return -1;
                    };

                    Midi.indexesOf = function (where, what) {
                        var result = [];
                        for (var i = 0; i < where.length; i++) {
                            var found = what.every(function (whati, j) {
                                return whati == where[i + j];
                            });
                            if (found) {
                                result.push(i);
                            }
                        }
                        return result;
                    };
                    return Midi;
                })();
                _Midi.Midi = Midi;
            })(Parsers.Midi || (Parsers.Midi = {}));
            var Midi = Parsers.Midi;
        })(Game.Parsers || (Game.Parsers = {}));
        var Parsers = Game.Parsers;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var displayHelp = (function () {
                            function displayHelp(p) {
                                this.p = p;
                                this.id = "display help";
                                this.description = "displays a help window";
                                this.key = "enter";
                                this.isDisplayed = false;
                                var o = this;
                                $.get("inputs/keyboard/actions/displayHelp/_assets/overlay.html?1").done(function (result) {
                                    $(result).appendTo("body");
                                    o.window = $("#displayHelpOverlay");
                                });
                            }
                            displayHelp.prototype.triggerAction = function () {
                                var o = this;
                                o.isDisplayed = !o.isDisplayed;
                                o.p.params.setParam("p_isPaused", o.isDisplayed);
                                o.display();
                            };

                            displayHelp.prototype.getCurrentState = function () {
                                var o = this;
                                return o.isDisplayed;
                            };

                            displayHelp.prototype.display = function () {
                                var o = this;
                                if (o.isDisplayed) {
                                    o.p.actions.done(function (actions) {
                                        o.p.params.subscribe("displayHelp", ".*", function (name, value) {
                                            o.refillTable(actions);
                                        });
                                        o.refillTable(actions);
                                        o.window.css("display", "block");
                                    });
                                } else {
                                    o.p.params.unsubscribe("displayHelp");
                                    o.window.css("display", "none");
                                }
                            };

                            displayHelp.prototype.refillTable = function (actions) {
                                var o = this;
                                var table = o.window.children("table");
                                table.find("tr:has(td)").html("");
                                var sortedActions = actions.sort(function (a, b) {
                                    return (a.id > b.id);
                                });
                                sortedActions.forEach(function (action) {
                                    var row = $("<tr/>").appendTo(table);
                                    var idCell = $("<td class='idCell'/>").appendTo(row);
                                    var keyCell = $("<td class='keyCell'/>").appendTo(row);
                                    var descriptionCell = $("<td class='descriptionCell'/>").appendTo(row);
                                    var currentCell = $("<td class='currentCell'/>").appendTo(row);
                                    idCell.text(action.id);
                                    keyCell.text("" + action.key);
                                    descriptionCell.text(action.description);
                                    currentCell.text(o.tryRoundValue(action.getCurrentState()));
                                });
                            };

                            displayHelp.prototype.tryRoundValue = function (value) {
                                if (typeof value == "number") {
                                    return Math.round(100 * value) / 100;
                                } else {
                                    return value;
                                }
                            };
                            return displayHelp;
                        })();
                        List.displayHelp = displayHelp;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Devices) {
        var Empty = (function () {
            function Empty() {
            }
            Empty.prototype.inOpen = function (nameOrIndex, callback) {
            };

            Empty.prototype.inClose = function () {
            };

            Empty.prototype.inList = function () {
                return [""];
            };

            Empty.prototype.exists = function () {
                return true;
            };

            Empty.prototype.out = function (byte1, byte2, byte3) {
            };

            Empty.prototype.outClose = function () {
            };

            Empty.prototype.outList = function () {
                return [""];
            };

            Empty.prototype.outOpen = function (name) {
            };

            Empty.prototype.time = function () {
                return Date.now();
            };
            return Empty;
        })();
        Devices.Empty = Empty;
    })(Musicope.Devices || (Musicope.Devices = {}));
    var Devices = Musicope.Devices;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Devices) {
        var jazz;

        var Jazz = (function () {
            function Jazz() {
                var o = this;
                if (!o.exists()) {
                    o.init();
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

            Jazz.prototype.init = function () {
                var jazz1 = document.createElement("object");
                var jazz2 = document.createElement("object");

                jazz1.setAttribute("classid", "CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90");
                jazz1.setAttribute("style", "margin-left:-1000px;");

                jazz2.setAttribute("type", "audio/x-jazz");
                jazz2.setAttribute("style", "visibility:hidden;");

                var styleStr = "visibility: visible; display:block; position:absolute; top:0; left:0; width:100%; height:100%; text-align: center; vertical-align:middle; font-size: xx-large; background-color: black; color: #ffe44c;";
                jazz2.innerHTML = '<div style="' + styleStr + '"><br />Please install <a style="color:red" href="http://jazz-soft.net/download/Jazz-Plugin/">JAZZ</a> plugin to make the game function. Thank you :-)</div>';

                jazz1.appendChild(jazz2);
                document.body.appendChild(jazz1);

                jazz = jazz1;
                if (!jazz || !jazz.isJazz) {
                    jazz = jazz2;
                }
            };
            return Jazz;
        })();
        Devices.Jazz = Jazz;
    })(Musicope.Devices || (Musicope.Devices = {}));
    var Devices = Musicope.Devices;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var MoveHome = (function () {
                            function MoveHome(p) {
                                this.p = p;
                                this.id = "move home";
                                this.description = "move to the initial state of the song";
                                this.key = "home";
                            }
                            MoveHome.prototype.triggerAction = function () {
                                var o = this;
                                o.p.params.setParam("p_elapsedTime", o.p.params.readOnly.p_initTime);
                            };

                            MoveHome.prototype.getCurrentState = function () {
                                var o = this;
                                return o.p.params.readOnly.p_elapsedTime / 1000;
                            };
                            return MoveHome;
                        })();
                        List.MoveHome = MoveHome;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var MoveBack = (function () {
                            function MoveBack(p) {
                                this.p = p;
                                this.id = "move back";
                                this.description = "move back by the amount of 2 beats";
                                this.key = "left";
                            }
                            MoveBack.prototype.triggerAction = function () {
                                var o = this;
                                var newTime = o.p.params.readOnly.p_elapsedTime - 2 * o.p.song.timePerBeat;
                                var truncTime = Math.max(o.p.params.readOnly.p_initTime, newTime);
                                o.p.params.setParam("p_elapsedTime", truncTime);
                            };

                            MoveBack.prototype.getCurrentState = function () {
                                var o = this;
                                return o.p.params.readOnly.p_elapsedTime / 1000;
                            };
                            return MoveBack;
                        })();
                        List.MoveBack = MoveBack;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var SpeedUp = (function () {
                            function SpeedUp(p) {
                                this.p = p;
                                this.id = "speed up";
                                this.description = "speed up the song by 10%";
                                this.key = "up";
                            }
                            SpeedUp.prototype.triggerAction = function () {
                                var o = this;
                                o.p.params.setParam("p_speed", o.p.params.readOnly.p_speed + 0.1);
                            };

                            SpeedUp.prototype.getCurrentState = function () {
                                var o = this;
                                return o.p.params.readOnly.p_speed * 100;
                            };
                            return SpeedUp;
                        })();
                        List.SpeedUp = SpeedUp;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var SlowDown = (function () {
                            function SlowDown(p) {
                                this.p = p;
                                this.id = "slow down";
                                this.description = "slow down the song by 10%";
                                this.key = "down";
                            }
                            SlowDown.prototype.triggerAction = function () {
                                var o = this;
                                o.p.params.setParam("p_speed", o.p.params.readOnly.p_speed - 0.1);
                            };

                            SlowDown.prototype.getCurrentState = function () {
                                var o = this;
                                return o.p.params.readOnly.p_speed * 100;
                            };
                            return SlowDown;
                        })();
                        List.SlowDown = SlowDown;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var WaitOn = (function () {
                            function WaitOn(p) {
                                this.p = p;
                                this.id = "wait";
                                this.description = "shall the song wait for the user?";
                                this.key = "w";
                                this.options = [[false, false], [true, true]];
                                this.names = ["off", "on"];
                            }
                            WaitOn.prototype.triggerAction = function () {
                                var o = this;
                                o.p.params.setParam("p_waits", Musicope.Game.Inputs.KeyboardFns.Actions.Tools.toggle(o.p.params.readOnly.p_waits, o.options));
                            };

                            WaitOn.prototype.getCurrentState = function () {
                                var o = this;
                                var i = o.options.indexOf(o.p.params.readOnly.p_waits);
                                return o.names[i];
                            };
                            return WaitOn;
                        })();
                        List.WaitOn = WaitOn;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (Tools) {
                        function areEqual(param1, param2) {
                            if (typeof param1 === "object" && typeof param2 === "object" && "every" in param1 && "every" in param2) {
                                var areEqual = param1.every(function (param1i, i) {
                                    return param1i == param2[i];
                                });
                                return areEqual;
                            } else {
                                return param1 == param2;
                            }
                        }
                        Tools.areEqual = areEqual;

                        function toggle(currentOption, options) {
                            for (var i = 0; i < options.length; i++) {
                                if (areEqual(currentOption, options[i])) {
                                    return options[(i + 1) % options.length];
                                }
                            }
                        }
                        Tools.toggle = toggle;
                    })(Actions.Tools || (Actions.Tools = {}));
                    var Tools = Actions.Tools;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        (function (ControllersFns) {
            function toKnockout(name, doc, fb) {
                var koDoc = {};
                for (var prop in doc) {
                    koDoc[prop] = ko.observable(doc[prop]);
                    koDoc[prop].subscribe(function (v) {
                        var js = ko.toJS(koDoc);
                        var en = btoa(name);
                        fb.child(en).set(js);
                    });
                }
                return koDoc;
            }

            function getDocsFromDB(ids, fb) {
                var done = $.Deferred();
                fb.once("value", function (data) {
                    var v = data.val() || {};
                    var res = ids.map(function (id) {
                        var js = v[btoa(id)] || { votes: 0 };
                        return toKnockout(id, js, fb);
                    });
                    done.resolve((res));
                });
                return done.promise();
            }

            function getSongsFromUrls(urls, docs) {
                var songs = urls.map(function (path, i) {
                    var vals = path.match(/^(.*\/)([^\/]+)\.([^.]+)$/);
                    var song = {
                        path: vals[1],
                        name: vals[2],
                        extension: vals[3],
                        url: path,
                        db: docs[i]
                    };
                    return song;
                });
                return songs;
            }

            function getSongListLocal(params, fb) {
                var out = $.Deferred();
                var xhr = new XMLHttpRequest();
                xhr.open('GET', params.readOnly.l_songsUrl);
                xhr.responseType = 'text';
                xhr.onload = function (e) {
                    if (this.status == 200) {
                        var paths = JSON.parse(this.responseText);
                        getDocsFromDB(paths, fb).done(function (docs) {
                            out.resolve(getSongsFromUrls(paths, docs));
                        });
                    }
                };
                xhr.send();
                return out.promise();
            }

            function getSongListRemote(params, fb) {
                var out = $.Deferred();
                var url = "../proxy.php?url=" + encodeURIComponent(params.readOnly.l_songsUrl);
                $.get(url).done(function (text) {
                    var paths = JSON.parse(atob(text));
                    getDocsFromDB(paths, fb).done(function (docs) {
                        out.resolve(getSongsFromUrls(paths, docs));
                    });
                });
                return out;
            }

            var Songs = (function () {
                function Songs() {
                    var _this = this;
                    this.getSongList = function (params) {
                        var o = _this;
                        var out = $.Deferred();
                        var isLocal = params.readOnly.l_songsUrl.indexOf("../") == 0;
                        if (isLocal) {
                            return getSongListLocal(params, o.fb);
                        } else {
                            return getSongListRemote(params, o.fb);
                        }
                    };
                    this.fb = new Firebase("https://musicope.firebaseio.com");
                }
                return Songs;
            })();
            ControllersFns.Songs = Songs;
        })(List.ControllersFns || (List.ControllersFns = {}));
        var ControllersFns = List.ControllersFns;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        var Controller = (function () {
            function Controller() {
                var _this = this;
                this.displayedSongs = ko.observableArray([]);
                this.songs = [];
                this.filteredSongs = [];
                this.params = new Musicope.List.Params();
                this.koInitGameParams = function () {
                    var o = _this;
                    o.gameParams = ko.observable(Musicope.LocStorage.get("gameParams", ""));
                    o.gameParams.subscribe(function (query) {
                        Musicope.LocStorage.set("gameParams", query);
                    });
                };
                this.koInitSearchQuery = function () {
                    var o = _this;
                    var initQuery = Musicope.LocStorage.get("query", "");
                    o.searchQuery = ko.observable(initQuery);
                    o.searchQuery.subscribe(function (query) {
                        if (query !== initQuery) {
                            o.listIndex(0);
                        }
                        Musicope.LocStorage.set("query", query);
                    });
                };
                this.koInitListIndex = function () {
                    var o = _this;
                    o.listIndex = ko.observable(Musicope.LocStorage.get("listIndex", 0));
                    o.listIndex.subscribe(function (i) {
                        Musicope.LocStorage.set("listIndex", i);
                    });
                };
                this.initInputs = function () {
                    var o = _this;
                    var params = {
                        controller: o
                    };
                    for (var prop in Musicope.List.Inputs.List) {
                        new Musicope.List.Inputs.List[prop](params);
                    }
                };
                this.scrollToFocusedEl = function () {
                    var o = _this;
                    var el = $(".elFocus");
                    if (el && el.length > 0) {
                        var index = o.listIndex();
                        var rely = el.offset()["top"] - $(window).scrollTop();
                        var dy = 0.5 * window.innerHeight - rely;
                        $(window).scrollTop($(window).scrollTop() - dy);
                    } else {
                        setTimeout(o.scrollToFocusedEl, 100);
                    }
                };
                this.initQueryManager = function () {
                    var o = _this;
                    var params = {
                        controller: o
                    };
                    o.queryManager = new Musicope.List.Query(params);
                };
                this.assignOnQueryUpdate = function () {
                    var o = _this;
                    o.searchQuery.subscribe(function (query) {
                        o.queryManager.onQueryUpdate(query);
                    });
                };
                this.assignCorrectVisibility = function () {
                    var o = _this;
                    $(window).scroll(function (e) {
                        var scrollEnd = $(document).height() - $(window).scrollTop() - $(window).height();
                        if (scrollEnd < 100) {
                            var songs = o.displayedSongs();
                            var length = songs.length;
                            for (var i = length; i < length + 10; i++) {
                                if (o.filteredSongs[i]) {
                                    songs.push(o.filteredSongs[i]);
                                }
                            }
                            o.displayedSongs.valueHasMutated();
                        }
                    });
                };
                var o = this;
                o = this;
                o.koInitGameParams();
                o.koInitSearchQuery();
                o.koInitListIndex();
                o.initInputs();

                var songs = new Musicope.List.ControllersFns.Songs();

                songs.getSongList(o.params).done(function (songs) {
                    o.songs = songs;
                    o.searchQuery.valueHasMutated();
                });

                o.scrollToFocusedEl();
                o.initQueryManager();
                o.assignOnQueryUpdate();
                o.assignCorrectVisibility();
            }
            Controller.prototype.redirect = function (indexFn, song) {
                var o = this;
                var index = indexFn();
                Musicope.LocStorage.set("listIndex", index);
                o.queryManager.onRedirect(index).done(function () {
                    var pars = o.gameParams();
                    if (!pars) {
                        pars = "";
                    }
                    if (pars.charAt(0) !== "&") {
                        pars = "&" + pars;
                    }
                    window.location.href = "../game/index.html?c_songUrl=" + encodeURIComponent(song.url) + pars;
                });
            };

            Controller.prototype.showGameParamsSetup = function () {
                $('gameParamsSetup').css("display", "block");
            };

            Controller.prototype.correctPosition = function (dom) {
                var el = $(dom);
                var rely = el.offset()["top"] - $(window).scrollTop() + 0.5 * el.height();
                if (rely > 0.9 * window.innerHeight) {
                    var dy = window.innerHeight - 1.5 * el.height() - rely;
                    $(window).scrollTop($(window).scrollTop() - dy);
                } else if (rely < 0.2 * window.innerHeight) {
                    $(window).scrollTop(el.offset()["top"] - 2 * el.height());
                }
                return true;
            };

            Controller.prototype.updateFilteredSongs = function (songs) {
                var o = this;
                o.filteredSongs = songs;
                var length = Math.min(o.listIndex() + 10, songs.length);
                o.displayedSongs(songs.slice(0, length));
            };
            return Controller;
        })();
        List.Controller = Controller;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var StartGame = (function () {
                            function StartGame(p) {
                                this.id = "start game";
                                this.description = "";
                                this.key = "enter";
                                var o = this;
                                o.contr = p.inputParams.controller;
                            }
                            StartGame.prototype.triggerAction = function () {
                                var o = this;
                                var song = o.contr.displayedSongs()[o.contr.listIndex()];
                                o.contr.redirect(o.contr.listIndex, song);
                            };

                            StartGame.prototype.getCurrentState = function () {
                                var o = this;
                                return 0;
                            };
                            return StartGame;
                        })();
                        List.StartGame = StartGame;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(List.Inputs || (List.Inputs = {}));
        var Inputs = List.Inputs;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var StepDown = (function () {
                            function StepDown(p) {
                                this.id = "step down";
                                this.description = "";
                                this.key = "down";
                                var o = this;
                                o.contr = p.inputParams.controller;
                            }
                            StepDown.prototype.triggerAction = function () {
                                var o = this;
                                var index = o.contr.listIndex() + 1;
                                var length = o.contr.displayedSongs().length;
                                var trimmedIndex = index >= length ? length - 1 : index;
                                o.contr.listIndex(trimmedIndex);
                            };

                            StepDown.prototype.getCurrentState = function () {
                                var o = this;
                                return 0;
                            };
                            return StepDown;
                        })();
                        List.StepDown = StepDown;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(List.Inputs || (List.Inputs = {}));
        var Inputs = List.Inputs;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var StepUp = (function () {
                            function StepUp(p) {
                                this.id = "step up";
                                this.description = "";
                                this.key = "up";
                                var o = this;
                                o.contr = p.inputParams.controller;
                            }
                            StepUp.prototype.triggerAction = function () {
                                var o = this;
                                var index = o.contr.listIndex() - 1;
                                var trimmedIndex = index < 0 ? 0 : index;
                                o.contr.listIndex(trimmedIndex);
                            };

                            StepUp.prototype.getCurrentState = function () {
                                var o = this;
                                return 0;
                            };
                            return StepUp;
                        })();
                        List.StepUp = StepUp;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(List.Inputs || (List.Inputs = {}));
        var Inputs = List.Inputs;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var VoteDown = (function () {
                            function VoteDown(p) {
                                this.id = "vote down";
                                this.description = "";
                                this.key = "ctrl+down";
                                var o = this;
                                o.contr = p.inputParams.controller;
                            }
                            VoteDown.prototype.triggerAction = function () {
                                var o = this;
                                var song = o.contr.displayedSongs()[o.contr.listIndex()];
                                song.db["votes"](song.db["votes"]() - 1);
                            };

                            VoteDown.prototype.getCurrentState = function () {
                                var o = this;
                                return 0;
                            };
                            return VoteDown;
                        })();
                        List.VoteDown = VoteDown;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(List.Inputs || (List.Inputs = {}));
        var Inputs = List.Inputs;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var VoteUp = (function () {
                            function VoteUp(p) {
                                this.id = "vote up";
                                this.description = "";
                                this.key = "ctrl+up";
                                var o = this;
                                o.contr = p.inputParams.controller;
                            }
                            VoteUp.prototype.triggerAction = function () {
                                var o = this;
                                var song = o.contr.displayedSongs()[o.contr.listIndex()];
                                song.db["votes"](song.db["votes"]() + 1);
                            };

                            VoteUp.prototype.getCurrentState = function () {
                                var o = this;
                                return 0;
                            };
                            return VoteUp;
                        })();
                        List.VoteUp = VoteUp;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(List.Inputs || (List.Inputs = {}));
        var Inputs = List.Inputs;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        (function (Inputs) {
            (function (List) {
                var Keyboard = (function () {
                    function Keyboard(params) {
                        this.params = params;
                        this.actions = [];
                        var o = this;
                        o.initActions();
                        o.signupActions();
                    }
                    Keyboard.prototype.initActions = function () {
                        var o = this;
                        var keyboardParams = {
                            inputParams: o.params
                        };
                        for (var prop in Musicope.List.Inputs.KeyboardFns.Actions.List) {
                            var action = new Musicope.List.Inputs.KeyboardFns.Actions.List[prop](keyboardParams);
                            o.actions.push(action);
                        }
                    };

                    Keyboard.prototype.signupActions = function () {
                        var o = this;
                        o.actions.forEach(function (action) {
                            Mousetrap.bind(action.key, function (e) {
                                action.triggerAction();
                                e.preventDefault();
                            });
                        });
                    };
                    return Keyboard;
                })();
                List.Keyboard = Keyboard;
            })(Inputs.List || (Inputs.List = {}));
            var List = Inputs.List;
        })(List.Inputs || (List.Inputs = {}));
        var Inputs = List.Inputs;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        (function (QueryFns) {
            (function (Actions) {
                (function (List) {
                    var filterSongs = (function () {
                        function filterSongs(p) {
                            this.id = "filter songs";
                            this.description = "";
                            this.regexp = /^.*$/;
                            this.priority = 100;
                            var o = this;
                            o.contr = p.inputParams.controller;
                        }
                        filterSongs.prototype.onQueryUpdate = function (query) {
                            var o = this;
                            var filteredSongs = o.getFilteredAndColoredSongs(query);
                            o.contr.updateFilteredSongs(filteredSongs);
                        };

                        filterSongs.prototype.getFilteredAndColoredSongs = function (query) {
                            var o = this;
                            var queries = Musicope.List.QueryFns.Actions.Tools.splitQuery(query);
                            var filteredSongs = Musicope.List.QueryFns.Actions.Tools.filterSongsByQueries(o.contr.songs, queries);
                            var sortedSongs = o.sortSongs(filteredSongs);
                            var coloredSongs = Musicope.List.QueryFns.Actions.Tools.colorSongsByQueries(sortedSongs, queries);
                            return coloredSongs;
                        };

                        filterSongs.prototype.sortSongs = function (songs) {
                            return songs.sort(function (a, b) {
                                var votesa = a.db["votes"]();
                                var votesb = b.db["votes"]();
                                if (votesa !== votesb) {
                                    return votesb - votesa;
                                } else {
                                    return a.name > b.name ? 1 : (a.name === b.name ? 0 : -1);
                                }
                            });
                        };
                        return filterSongs;
                    })();
                    List.filterSongs = filterSongs;
                })(Actions.List || (Actions.List = {}));
                var List = Actions.List;
            })(QueryFns.Actions || (QueryFns.Actions = {}));
            var Actions = QueryFns.Actions;
        })(List.QueryFns || (List.QueryFns = {}));
        var QueryFns = List.QueryFns;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        (function (QueryFns) {
            (function (Actions) {
                (function (Tools) {
                    function colorStringByQueries(str, queries) {
                        queries.forEach(function (query) {
                            str = str.replace(new RegExp(query, 'gi'), '{$&}');
                        });
                        for (var i = 0; i < queries.length; i++) {
                            str = str.replace(/\{([^{]+?)\}/g, '<span class="search-match">$1</span>');
                        }
                        return str;
                    }

                    function colorSongByQueries(song, queries) {
                        var coloredName = colorStringByQueries(song.name, queries);
                        var coloredPath = colorStringByQueries(song.path, queries);
                        var coloredSong = {
                            name: coloredName,
                            path: coloredPath,
                            url: song.url,
                            db: song.db,
                            extension: song.extension
                        };
                        return coloredSong;
                    }

                    function colorSongsByQueries(songs, queries) {
                        var coloredSongs = songs.map(function (song) {
                            if (queries.length > 0 && queries[0].length > 0) {
                                return colorSongByQueries(song, queries);
                            } else {
                                return song;
                            }
                        });
                        return coloredSongs;
                    }
                    Tools.colorSongsByQueries = colorSongsByQueries;

                    function filterSongsByQueries(songs, queries) {
                        return songs.filter(function (song, i) {
                            var url = song.url.toLowerCase();
                            return queries.every(function (query) {
                                return url.indexOf(query) > -1;
                            });
                        });
                    }
                    Tools.filterSongsByQueries = filterSongsByQueries;

                    function splitQuery(query) {
                        var queries = query.toLowerCase().split(" ");
                        var trimmedQueries = queries.map(function (query) {
                            return query.trim();
                        });
                        var nonEmptyQueries = trimmedQueries.filter(function (query) {
                            return query != "";
                        });
                        return nonEmptyQueries;
                    }
                    Tools.splitQuery = splitQuery;
                })(Actions.Tools || (Actions.Tools = {}));
                var Tools = Actions.Tools;
            })(QueryFns.Actions || (QueryFns.Actions = {}));
            var Actions = QueryFns.Actions;
        })(List.QueryFns || (List.QueryFns = {}));
        var QueryFns = List.QueryFns;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        var Query = (function () {
            function Query(params) {
                this.params = params;
                this.actions = [];
                var o = this;
                o.contr = params.controller;
                o.pushActions();
                o.sortActions();
            }
            Query.prototype.pushActions = function () {
                var o = this;
                var params = {
                    inputParams: o.params
                };
                for (var prop in Musicope.List.QueryFns.Actions.List) {
                    var constr = Musicope.List.QueryFns.Actions.List[prop];
                    o.actions.push(new constr(params));
                }
            };

            Query.prototype.sortActions = function () {
                var o = this;
                o.actions.sort(function (a, b) {
                    return (a.priority > b.priority);
                });
            };

            Query.prototype.onQueryUpdate = function (query) {
                var o = this;
                o.actions.forEach(function (action) {
                    var pos = query.search(action.regexp);
                    if (pos !== -1) {
                        action.onQueryUpdate(query);
                    }
                });
            };

            Query.prototype.onRedirect = function (displayedSongsIndex) {
                var o = this;
                var promises = [];
                o.actions.forEach(function (action) {
                    if (action.onRedirect) {
                        promises.push(action.onRedirect(displayedSongsIndex));
                    }
                });
                return $.when.apply(null, promises);
            };
            return Query;
        })();
        List.Query = Query;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        List.defParams = {
            l_songsUrl: "../songs/songs.json?" + Math.random()
        };
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (List) {
        var Params = (function () {
            function Params() {
                this.subscribtions = [];
                var o = this;
                o.readOnly = Musicope.Params.getUrlParams(Musicope.List.defParams);
            }
            Params.prototype.subscribe = function (regex, callback) {
                var o = this;
                o.subscribtions.push({
                    regex: new RegExp(regex),
                    callback: callback
                });
            };

            Params.prototype.setParam = function (name, value, dontNotifyOthers) {
                var o = this;
                o.readOnly[name] = value;
                if (!dontNotifyOthers) {
                    o.call(name, value);
                }
            };

            Params.prototype.areEqual = function (param1, param2) {
                if ("every" in param1 && "every" in param2) {
                    var areEqual = param1.every(function (param1i, i) {
                        return param1i == param2[i];
                    });
                    return areEqual;
                } else {
                    return param1 == param2;
                }
            };

            Params.prototype.call = function (param, value) {
                var o = this;
                o.subscribtions.forEach(function (s) {
                    if (param.search(s.regex) > -1) {
                        s.callback(param, value);
                    }
                });
            };
            return Params;
        })();
        List.Params = Params;
    })(Musicope.List || (Musicope.List = {}));
    var List = Musicope.List;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Params) {
        function getUrlParams(_default) {
            var params = $.url().param();
            var out = {};
            for (var name in _default) {
                if (name in params) {
                    try  {
                        out[name] = JSON.parse(params[name]);
                    } catch (e) {
                        out[name] = params[name];
                    }
                } else {
                    out[name] = _default[name];
                }
            }
            return out;
        }
        Params.getUrlParams = getUrlParams;
    })(Musicope.Params || (Musicope.Params = {}));
    var Params = Musicope.Params;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (LocStorage) {
        function get(name, defaultValue) {
            var val = localStorage.getItem(name);
            if (!val || val === "undefined") {
                return defaultValue;
            } else {
                try  {
                    return JSON.parse(val);
                } catch (e) {
                    return val;
                }
            }
        }
        LocStorage.get = get;

        function set(name, value) {
            var val = JSON.stringify(value);
            localStorage.setItem(name, val);
        }
        LocStorage.set = set;
    })(Musicope.LocStorage || (Musicope.LocStorage = {}));
    var LocStorage = Musicope.LocStorage;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        var Controller = (function () {
            function Controller() {
                this.requestAnimationFrame = window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] || window["msRequestAnimationFrame"] || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
                var o = this;

                o.params = new Musicope.Game.Params();

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
            Controller.prototype.getSong = function () {
                var o = this;
                var out = $.Deferred();
                var isLocal = o.params.readOnly.c_songUrl.indexOf("../") == 0;
                if (isLocal) {
                    return o.getSongLocal();
                } else {
                    return o.getSongRemote();
                }
            };

            Controller.prototype.getSongLocal = function () {
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

            Controller.prototype.getSongRemote = function () {
                var o = this;
                var out = $.Deferred();
                var url = "../proxy.php?url=" + encodeURIComponent(o.params.readOnly.c_songUrl);
                $.get(url).done(function (text) {
                    var arr = atob(text);
                    out.resolve(arr);
                });
                return out;
            };

            Controller.prototype.init = function (arr) {
                var o = this;
                o.song = new Musicope.Game.Song(arr, o.params);
                o.scene = new Musicope.Game.Scene(o.song, o.params);
                o.metronome = new Musicope.Game.Metronome(o.song.timePerBeat, o.song.timePerBar / o.song.timePerBeat, o.device, o.params);
                o.player = new Musicope.Game.Player(o.device, o.song, o.metronome, o.scene, o.params);
                for (var prop in Musicope.Game.Inputs) {
                    if (prop.indexOf("Fns") < 0) {
                        new Musicope.Game.Inputs[prop](o.params, o.song);
                    }
                }
                o.step();
            };

            Controller.prototype.step = function () {
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

            Controller.prototype.redirect = function () {
                var o = this;
                window.location.href = o.params.readOnly.c_callbackUrl;
            };
            return Controller;
        })();
        Game.Controller = Controller;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            var Keyboard = (function () {
                function Keyboard(params, song) {
                    this.params = params;
                    this.song = song;
                    this.actions = [];
                    var o = this;
                    o.initActions();
                    o.checkActionsDuplicates();
                    o.signupActions();
                }
                Keyboard.prototype.initActions = function () {
                    var o = this;
                    var deff = $.Deferred();
                    var keyboardParams = {
                        params: o.params,
                        song: o.song,
                        actions: deff.promise()
                    };
                    for (var prop in Musicope.Game.Inputs.KeyboardFns.Actions.List) {
                        var action = new Musicope.Game.Inputs.KeyboardFns.Actions.List[prop](keyboardParams);
                        o.actions.push(action);
                    }
                    deff.resolve(o.actions);
                };

                Keyboard.prototype.checkActionsDuplicates = function () {
                    var o = this;
                    var keys = {};
                    o.actions.forEach(function (action) {
                        if (keys[action.key]) {
                            var text = "duplicate keys: '" + keys[action.key] + "' vs '" + action.id + "'";
                            throw text;
                        }
                        keys[action.key] = action.id;
                    });
                };

                Keyboard.prototype.signupActions = function () {
                    var o = this;
                    o.actions.forEach(function (action) {
                        Mousetrap.bind(action.key, function () {
                            action.triggerAction();
                            Musicope.Game.Inputs.KeyboardFns.Overlay.display(action.id, action.getCurrentState());
                        });
                    });
                };
                return Keyboard;
            })();
            Inputs.Keyboard = Keyboard;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var MoveForward = (function () {
                            function MoveForward(p) {
                                this.p = p;
                                this.id = "move forward";
                                this.description = "move forward by the amount of 2 beats";
                                this.key = "right";
                            }
                            MoveForward.prototype.triggerAction = function () {
                                var o = this;
                                var newTime = o.p.params.readOnly.p_elapsedTime + 2 * o.p.song.timePerBeat;
                                var truncTime = Math.min(o.p.song.timePerSong + 10, newTime);
                                o.p.params.setParam("p_elapsedTime", truncTime);
                            };

                            MoveForward.prototype.getCurrentState = function () {
                                var o = this;
                                return o.p.params.readOnly.p_elapsedTime / 1000;
                            };
                            return MoveForward;
                        })();
                        List.MoveForward = MoveForward;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var MetronomeOn = (function () {
                            function MetronomeOn(p) {
                                this.p = p;
                                this.id = "metronome";
                                this.description = "toggle state of the metronome on/off";
                                this.key = "m";
                            }
                            MetronomeOn.prototype.triggerAction = function () {
                                var o = this;
                                o.p.params.setParam("m_isOn", !o.p.params.readOnly.m_isOn);
                            };

                            MetronomeOn.prototype.getCurrentState = function () {
                                var o = this;
                                return o.p.params.readOnly.m_isOn ? "on" : "off";
                            };
                            return MetronomeOn;
                        })();
                        List.MetronomeOn = MetronomeOn;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var PauseOn = (function () {
                            function PauseOn(p) {
                                this.p = p;
                                this.id = "pause";
                                this.description = "pause and unpause the game";
                                this.key = "space";
                            }
                            PauseOn.prototype.triggerAction = function () {
                                var o = this;
                                o.p.params.setParam("p_isPaused", !o.p.params.readOnly.p_isPaused);
                            };

                            PauseOn.prototype.getCurrentState = function () {
                                var o = this;
                                return o.p.params.readOnly.p_isPaused ? "on" : "off";
                            };
                            return PauseOn;
                        })();
                        List.PauseOn = PauseOn;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Actions) {
                    (function (List) {
                        var UserHands = (function () {
                            function UserHands(p) {
                                this.p = p;
                                this.id = "user hands";
                                this.description = "toggle which hands the user plays.";
                                this.key = "h";
                                this.options = [[false, false], [false, true], [true, false], [true, true]];
                                this.names = ["none", "right", "left", "both"];
                            }
                            UserHands.prototype.triggerAction = function () {
                                var o = this;
                                o.p.params.setParam("p_userHands", Musicope.Game.Inputs.KeyboardFns.Actions.Tools.toggle(o.p.params.readOnly.p_userHands, o.options));
                            };

                            UserHands.prototype.getCurrentState = function () {
                                var o = this;
                                var i = o.options.indexOf(o.p.params.readOnly.p_userHands);
                                return o.names[i];
                            };
                            return UserHands;
                        })();
                        List.UserHands = UserHands;
                    })(Actions.List || (Actions.List = {}));
                    var List = Actions.List;
                })(KeyboardFns.Actions || (KeyboardFns.Actions = {}));
                var Actions = KeyboardFns.Actions;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        var Metronome = (function () {
            function Metronome(timePerBeat, beatsPerBar, device, params) {
                this.timePerBeat = timePerBeat;
                this.beatsPerBar = beatsPerBar;
                this.device = device;
                this.params = params;
                this.lastPlayedId = -10000;
                var o = this;
                o.subscribe();
            }
            Metronome.prototype.play = function (time) {
                var o = this;
                if (o.params.readOnly.m_isOn) {
                    var id = Math.floor(o.params.readOnly.m_ticksPerBeat * time / o.timePerBeat);
                    if (id > o.lastPlayedId) {
                        var noteId = id % o.beatsPerBar == 0 ? o.params.readOnly.m_id1 : o.params.readOnly.m_id2;
                        var velocity = Math.min(127, o.params.readOnly.m_velocity);
                        o.device.out(o.params.readOnly.m_channel, noteId, velocity);
                        o.lastPlayedId = id;
                    }
                }
            };

            Metronome.prototype.reset = function () {
                this.lastPlayedId = -10000;
            };

            Metronome.prototype.subscribe = function () {
                var o = this;
                o.params.subscribe("metronomes.Basic", "^m_.+$", function (name, value) {
                    o.reset();
                });
            };
            return Metronome;
        })();
        Game.Metronome = Metronome;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        var Song = (function () {
            function Song(midi, params) {
                this.params = params;
                this.minPlayedNoteId = 200;
                this.maxPlayedNoteId = 0;
                var o = this;
                o.setParamsFromParser(new Musicope.Game.Parsers.Midi.Midi(midi));
                o.sortPlayerTracksByHands();
                o.normalizeVolumeOfPlayerTracks();
                o.filterSustainNotes();
                o.computeSceneSustainNotes();
                o.computeSceneTracks();
                o.setMinMaxNoteId();
                o.computeCleanedPlayerTracks();
                o.computeTimePerSong();
            }
            Song.prototype.setParamsFromParser = function (parser) {
                var o = this;
                o.noteValuePerBeat = parser.noteValuePerBeat;
                o.timePerBar = parser.timePerBar;
                o.timePerBeat = parser.timePerBeat;
                o.playerTracks = parser.tracks;
                o.sustainNotes = parser.sustainNotes;
            };

            Song.prototype.sortPlayerTracksByHands = function () {
                var o = this;
                o.playerTracks = o.params.readOnly.f_trackIds.map(function (trackId) {
                    return o.playerTracks[trackId] || [];
                });
            };

            Song.prototype.normalizeVolumeOfPlayerTracks = function () {
                var o = this;
                if (o.params.readOnly.f_normalize) {
                    var sumVelocity = 0, n = 0;
                    o.playerTracks.forEach(function (notes) {
                        notes.forEach(function (note) {
                            if (note.on) {
                                n++;
                                sumVelocity += note.velocity;
                            }
                        });
                    });
                    var scaleVel = o.params.readOnly.f_normalize / (sumVelocity / n);
                    if (scaleVel < 1.0) {
                        o.playerTracks.forEach(function (notes) {
                            notes.forEach(function (note) {
                                note.velocity = Math.max(0, Math.min(127, scaleVel * note.velocity));
                            });
                        });
                    }
                }
            };

            Song.prototype.filterSustainNotes = function () {
                var o = this;
                var last = false;
                o.sustainNotes = o.sustainNotes.filter(function (note) {
                    var isok = (note.on && !last) || (!note.on && last);
                    last = note.on;
                    return isok;
                });
            };

            Song.prototype.computeSceneSustainNotes = function () {
                var o = this;
                o.sceneSustainNotes = [];
                var tempNote;
                o.sustainNotes.forEach(function (note) {
                    if (note.on) {
                        if (tempNote) {
                            o.sceneSustainNotes.push({ timeOn: tempNote.time, timeOff: note.time });
                        }
                        tempNote = note;
                    } else if (tempNote) {
                        o.sceneSustainNotes.push({ timeOn: tempNote.time, timeOff: note.time });
                        tempNote = undefined;
                    }
                });
            };

            Song.prototype.computeSceneTracks = function () {
                var o = this;
                o.sceneTracks = o.playerTracks.map(function (playerNotes) {
                    var sceneNotes = [], tempNotes = {};
                    playerNotes.forEach(function (note, i) {
                        if (note.on) {
                            if (tempNotes[note.id]) {
                                var noteScene = o.getSceneNote(tempNotes[note.id], note);
                                sceneNotes.push(noteScene);
                            }
                            tempNotes[note.id] = note;
                        } else {
                            var tn = tempNotes[note.id];
                            if (tn) {
                                var noteScene = o.getSceneNote(tempNotes[note.id], note);
                                sceneNotes.push(noteScene);
                                tempNotes[note.id] = undefined;
                            }
                        }
                    });
                    return sceneNotes;
                });
            };

            Song.prototype.getSceneNote = function (noteOn, noteOff) {
                return {
                    timeOn: noteOn.time,
                    timeOff: noteOff.time,
                    id: noteOn.id,
                    velocityOn: noteOn.velocity,
                    velocityOff: noteOff.velocity
                };
            };

            Song.prototype.setMinMaxNoteId = function () {
                var o = this;
                o.sceneTracks.forEach(function (notes) {
                    notes.forEach(function (note) {
                        o.maxPlayedNoteId = Math.max(note.id, o.maxPlayedNoteId);
                        o.minPlayedNoteId = Math.min(note.id, o.minPlayedNoteId);
                    });
                });
            };

            Song.prototype.computeCleanedPlayerTracks = function () {
                var o = this;
                o.playerTracks = o.sceneTracks.map(function (sceneNotes) {
                    var notesPlayer = [];
                    sceneNotes.forEach(function (note) {
                        notesPlayer.push({ on: true, time: note.timeOn, id: note.id, velocity: note.velocityOn });
                        notesPlayer.push({ on: false, time: note.timeOff, id: note.id, velocity: note.velocityOff });
                    });
                    return notesPlayer.sort(function (a, b) {
                        var dt = a.time - b.time;
                        if (dt !== 0) {
                            return dt;
                        } else {
                            return a.on ? 1 : -1;
                        }
                    });
                });
            };

            Song.prototype.computeTimePerSong = function () {
                var o = this;
                o.timePerSong = 0;
                o.playerTracks.forEach(function (notes) {
                    notes.forEach(function (note) {
                        if (note.time > o.timePerSong) {
                            o.timePerSong = note.time;
                        }
                    });
                });
            };
            return Song;
        })();
        Game.Song = Song;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Inputs) {
            (function (KeyboardFns) {
                (function (Overlay) {
                    var displayDescription;
                    var displayValue;
                    var oldTimeOut;

                    function createDomIfNeeded() {
                        if (!displayDescription || !displayValue) {
                            var container = $("<div style='position:absolute; top:0px; left:0; color:white; font-size:xx-large; text-align:left;' />").appendTo("body");
                            displayDescription = $("<span />").appendTo(container);
                            displayValue = $("<span style='color:red;' />").appendTo(container);
                        }
                    }

                    function display(description, value) {
                        var str;
                        if (typeof value == "number") {
                            str = Math.round(1000 * value) / 1000;
                        } else {
                            str = value;
                        }

                        createDomIfNeeded();
                        displayDescription.text(description + ": ");
                        displayValue.text(str);
                        clearTimeout(oldTimeOut);
                        oldTimeOut = setTimeout(function () {
                            displayDescription.text("");
                            displayValue.text("");
                        }, 5000);
                    }
                    Overlay.display = display;
                })(KeyboardFns.Overlay || (KeyboardFns.Overlay = {}));
                var Overlay = KeyboardFns.Overlay;
            })(Inputs.KeyboardFns || (Inputs.KeyboardFns = {}));
            var KeyboardFns = Inputs.KeyboardFns;
        })(Game.Inputs || (Game.Inputs = {}));
        var Inputs = Game.Inputs;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        var Player = (function () {
            function Player(device, song, metronome, scene, params) {
                var _this = this;
                this.device = device;
                this.song = song;
                this.metronome = metronome;
                this.scene = scene;
                this.params = params;
                this.step = function () {
                    var o = _this;
                    o.playNotes.play();
                    o.playSustains.play();
                    o.metronome.play(o.params.readOnly.p_elapsedTime);
                    o.scene.redraw(o.params.readOnly.p_elapsedTime, o.params.readOnly.p_isPaused);
                    var isFreeze = o.waitForNote.isFreeze();
                    o.hideTimeBarIfStops(isFreeze);
                    return o.updateTime(isFreeze);
                };
                this.correctTimesInParams = function () {
                    var o = _this;
                    if (typeof o.params.readOnly.p_initTime == 'undefined') {
                        o.params.setParam("p_initTime", -2 * o.song.timePerBar);
                    }
                    if (typeof o.params.readOnly.p_elapsedTime == 'undefined') {
                        o.params.setParam("p_elapsedTime", o.params.readOnly.p_initTime);
                    }
                };
                this.subscribeToParamsChange = function () {
                    var o = _this;
                    o.params.subscribe("players.Basic", "^p_elapsedTime$", function (name, value) {
                        o.reset();
                    });
                };
                this.reset = function () {
                    var o = _this;
                    o.scene.unsetAllActiveIds();
                    o.metronome.reset();
                    var idsBelowCurrentTime = o.getIdsBelowCurrentTime();
                    o.waitForNote.reset(idsBelowCurrentTime);
                    o.playNotes.reset(idsBelowCurrentTime);
                    o.deviceOnNotesToOff();
                };
                this.deviceOnNotesToOff = function () {
                    var o = _this;
                    for (var i = 0; i < 128; i++) {
                        o.device.out(144, i, 0);
                    }
                };
                this.getIdsBelowCurrentTime = function () {
                    var o = _this;
                    return o.song.playerTracks.map(o.getIdBelowCurrentTime);
                };
                this.getIdBelowCurrentTime = function (notes) {
                    var o = _this;
                    if (notes.length > 0) {
                        var id = notes.length - 1;
                        while (id >= 0 && notes[id] && notes[id].time > o.params.readOnly.p_elapsedTime) {
                            id--;
                        }
                        return id;
                    }
                };
                this.assignClasses = function () {
                    var o = _this;
                    o.fromDevice = new Musicope.Game.PlayerFns.FromDevice(o.device, o.scene, o.params, o.song.playerTracks);
                    o.playNotes = new Musicope.Game.PlayerFns.PlayNotes(o.device, o.scene, o.params, o.song.playerTracks);
                    o.playSustains = new Musicope.Game.PlayerFns.PlaySustains(o.device, o.params, o.song.sustainNotes);
                    o.waitForNote = new Musicope.Game.PlayerFns.WaitForNote(o.device, o.params, o.song.playerTracks, o.fromDevice.onNoteOn);
                };
                this.updateTime = function (isFreeze) {
                    var o = _this;
                    var currentTime = o.device.time();
                    if (!o.previousTime) {
                        o.previousTime = currentTime;
                    }
                    var duration = currentTime - o.previousTime;
                    o.previousTime = currentTime;

                    var isSongEnd = o.params.readOnly.p_elapsedTime > o.song.timePerSong + 1000;

                    var doFreezeTime = isSongEnd || o.params.readOnly.p_isPaused || isFreeze || duration > 100;

                    if (!doFreezeTime) {
                        var newElapsedTime = o.params.readOnly.p_elapsedTime + o.params.readOnly.p_speed * duration;
                        o.params.setParam("p_elapsedTime", newElapsedTime, true);
                    }

                    return isSongEnd;
                };
                this.hideTimeBarIfStops = function (isFreeze) {
                    var o = _this;
                    if (isFreeze) {
                        o.scene.setActiveId(2);
                        o.scene.setActiveId(1);
                    } else {
                        o.scene.unsetActiveId(2);
                        o.scene.unsetActiveId(1);
                    }
                };
                var o = this;
                o = this;
                o.correctTimesInParams();
                o.subscribeToParamsChange();
                o.assignClasses();
            }
            return Player;
        })();
        Game.Player = Player;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Benchmark = (function () {
        function Benchmark() {
            this.displayEvery = 20;
            this.lastHeapSize = 0;
            this.heapSizeId = 0;
            this.lastFPSTime = 0;
            this.id = 0;
            var o = this;
            var domjq = $("<div />").appendTo("body");
            domjq.css({
                position: "absolute",
                top: 40,
                left: 0,
                "text-align": "left",
                color: "white",
                "z-index": 100
            });
            o.dom = domjq[0];
        }
        Benchmark.prototype.display = function () {
            var o = this;
            if (o.id++ > o.displayEvery) {
                o.id = 0;
                var fps = o.getFPS();
                var heapSizePerSec = o.getHeapSize() / (o.displayEvery / fps) / 1000;
                var roundedHeapSize = Math.round(100 * heapSizePerSec) / 100;
                o.dom.innerText = "fps = " + fps + ", " + roundedHeapSize + " kB/s";
            }
        };

        Benchmark.prototype.getFPS = function () {
            var o = this;
            var time = Date.now();
            var fps = o.displayEvery * 1000 / (time - o.lastFPSTime);
            var out = Math.round(100 * fps) / 100;
            o.lastFPSTime = time;
            return out;
        };

        Benchmark.prototype.getHeapSize = function () {
            var o = this;
            var heapSize = window.performance.memory.usedJSHeapSize;
            var out = heapSize - o.lastHeapSize;
            o.lastHeapSize = heapSize;
            return out;
        };
        return Benchmark;
    })();
    Musicope.Benchmark = Benchmark;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (SceneFns) {
            // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
            function hexToRgb(hex, alpha) {
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                    return (r + r + g + g + b + b);
                });
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255, alpha || 1];
            }
            SceneFns.hexToRgb = hexToRgb;

            var whiteNoteIds = [
                21, 23,
                24, 26, 28, 29, 31, 33, 35,
                36, 38, 40, 41, 43, 45, 47,
                48, 50, 52, 53, 55, 57, 59,
                60, 62, 64, 65, 67, 69, 71,
                72, 74, 76, 77, 79, 81, 83,
                84, 86, 88, 89, 91, 93, 95,
                96, 98, 100, 101, 103, 105, 107,
                108];

            var blackNoteIds = [
                22,
                25, 27, 30, 32, 34,
                37, 39, 42, 44, 46,
                49, 51, 54, 56, 58,
                61, 63, 66, 68, 70,
                73, 75, 78, 80, 82,
                85, 87, 90, 92, 94,
                97, 99, 102, 104, 106];

            var blackNoteSpots = [
                1, 3, 4, 6, 7, 8, 10, 11, 13, 14, 15, 17, 18, 20, 21, 22, 24, 25, 27, 28, 29, 31, 32,
                34, 35, 36, 38, 39, 41, 42, 43, 45, 46, 48, 49, 50];

            function drawNoteCover(loc) {
                if (loc.input.readOnly.s_noteCoverRelHeight > 0.0) {
                    var y0 = loc.yEndOfTimeBar;
                    var y1 = y0 + loc.input.readOnly.s_noteCoverRelHeight * (loc.input.sceneHeight - loc.yEndOfTimeBar);
                    var color = [0, 0, 0, 1];
                    var activeColor = [0, 0, 0, 0.5];
                    loc.input.drawRect(0, y0, loc.input.sceneWidth + 1, y1, [1], color, activeColor);
                }
            }

            function drawPianoBlackNotes(loc) {
                blackNoteIds.forEach(function (id, i) {
                    var x0 = blackNoteSpots[i] * loc.whiteWidth - loc.blackWidth + 2;
                    var x1 = x0 + 2 * loc.blackWidth - 3;
                    var y0 = Math.floor(loc.yEndOfPiano * 0.4);
                    var y1 = loc.yEndOfPiano - 2;
                    var activeColor = hexToRgb(loc.input.readOnly.s_colPianoBlack);
                    loc.input.drawRect(x0, y0, x1, y1, [id], [0, 0, 0, 1], activeColor);
                });
            }

            function getColorForWhitePianoNotes(id, loc) {
                var unPressedColor = [1, 1, 1, 1];
                var neverPlayedNote = id < loc.input.minPlayedNoteId || id > loc.input.maxPlayedNoteId;
                var outOfReachNote = id < loc.input.p_minNote || id > loc.input.p_maxNote;
                var color;
                if (neverPlayedNote && !outOfReachNote) {
                    var notPlayedColor = hexToRgb(loc.input.readOnly.s_colUnPlayedNotesInReach);
                    color = notPlayedColor;
                } else if (neverPlayedNote) {
                    var notPlayedColor = hexToRgb(loc.input.readOnly.s_colUnPlayedNotes);
                    color = notPlayedColor;
                } else if (outOfReachNote) {
                    var outOfReachColor = hexToRgb(loc.input.readOnly.s_colOutOfReachNotes);
                    color = outOfReachColor;
                } else {
                    color = unPressedColor;
                }
                return color;
            }

            function drawPianoWhiteNotes(loc) {
                whiteNoteIds.forEach(function (id, i) {
                    var x0 = i * loc.whiteWidth;
                    var x1 = x0 + loc.whiteWidth - 1;
                    var y0 = 12;
                    var y1 = loc.yEndOfPiano - 2;
                    var color = getColorForWhitePianoNotes(id, loc);
                    var activeColor = hexToRgb(loc.input.readOnly.s_colPianoWhite);
                    loc.input.drawRect(x0, y0, x1, y1, [id], color, activeColor);
                });
            }

            function drawPianoTimeBarColor(loc) {
                var color = hexToRgb(loc.input.readOnly.s_colTime, 0.9);
                var activeColor = hexToRgb(loc.input.readOnly.s_colTime, 0.4);
                var y0 = loc.yEndOfPiano;
                var y1 = loc.yEndOfTimeBar;
                loc.input.drawRect(0, y0, 1, y1, [1, 2, 2, 1], color, activeColor);
            }

            function drawPianoTimeBarWhite(loc) {
                var y0 = loc.yEndOfPiano;
                var y1 = loc.yEndOfTimeBar;
                var color = [1, 1, 1, 0.9];
                var activeColor = [1, 1, 1, 0.4];
                loc.input.drawRect(0, y0, loc.input.sceneWidth, y1, [2, 1, 1, 2], color, activeColor);
                loc.input.drawRect(0, y1, loc.input.sceneWidth, 2 * y1 - y0, [3, 3, 3, 3], [0, 1, 0, 0.3], activeColor);
            }

            function drawPianoBackBlack(loc) {
                var y1 = loc.yEndOfPiano;
                loc.input.drawRect(0, 0, loc.input.sceneWidth + 1, y1, [150], [0, 0, 0, 1], [0, 0, 0, 1]);
            }

            function drawTimeBar(loc) {
                drawPianoTimeBarWhite(loc);
                drawPianoTimeBarColor(loc);
            }

            function drawPiano(loc) {
                if (loc.input.readOnly.s_showPiano) {
                    drawPianoBackBlack(loc);
                    drawPianoWhiteNotes(loc);
                    drawPianoBlackNotes(loc);
                }
            }

            function drawSustainNotes(loc) {
                var color = hexToRgb(loc.input.readOnly.s_colSustain);
                loc.input.sustainNotes.forEach(function (note) {
                    var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 1;
                    var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
                    var ipos = whiteNoteIds.length;
                    var x0 = ipos * loc.whiteWidth + 3;
                    var x1 = x0 + loc.whiteWidth - 5;
                    loc.input.drawRect(x0, y0, x1, y1, [200], color, color);
                });
            }

            function getColorByVelocity(color, velocity, minMaxVel) {
                if (Math.abs(minMaxVel[1] - minMaxVel[0]) > 10) {
                    var out = [];
                    var scale = 0.6 + 0.4 * (velocity - minMaxVel[0]) / (minMaxVel[1] - minMaxVel[0]);
                    out.push(scale * color[0]);
                    out.push(scale * color[1]);
                    out.push(scale * color[2]);
                    out.push(color[3]);
                    return out;
                } else {
                    return color;
                }
            }

            function getMinMaxVelocity(notes) {
                var max = 0, min = 200;
                notes.forEach(function (note) {
                    max = Math.max(max, note.velocityOn);
                    min = Math.min(min, note.velocityOn);
                });
                return [min, max];
            }

            function drawTrack(loc, trackId) {
                var whiteNoteColor = hexToRgb(loc.input.readOnly.s_colWhites[trackId]);
                var blackNoteColor = hexToRgb(loc.input.readOnly.s_colBlacks[trackId]);
                var minMaxVel = getMinMaxVelocity(loc.input.tracks[trackId]);
                loc.input.tracks[trackId].forEach(function (note) {
                    var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 1;
                    var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
                    var ipos = whiteNoteIds.indexOf(note.id);
                    if (ipos >= 0) {
                        var x0 = ipos * loc.whiteWidth + 3;
                        var x1 = x0 + loc.whiteWidth - 5;
                        var color = getColorByVelocity(whiteNoteColor, note.velocityOn, minMaxVel);
                        loc.input.drawRect(x0, y0, x1, y1, [trackId + 200], color, color);
                    } else {
                        var pos = blackNoteIds.indexOf(note.id);
                        if (pos >= 0) {
                            var x0 = blackNoteSpots[pos] * loc.whiteWidth - loc.blackWidth + 2;
                            var x1 = x0 + 2 * loc.blackWidth - 3;
                            var color = getColorByVelocity(blackNoteColor, note.velocityOn, minMaxVel);
                            loc.input.drawRect(x0, y0, x1, y1, [trackId + 202], color, color);
                        }
                    }
                });
            }

            function drawSustainBackground(loc) {
                if (loc.input.readOnly.s_showSustainBg) {
                    var color = hexToRgb(loc.input.readOnly.s_colSustain);
                    var color2 = hexToRgb(loc.input.readOnly.s_colSustain, 0.5);
                    loc.input.sustainNotes.forEach(function (note) {
                        var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 1;
                        var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
                        var ipos = whiteNoteIds.length;
                        loc.input.drawRect(0, y0, loc.input.sceneWidth + 1, y0 + 2, [200], color, color);
                        loc.input.drawRect(0, y1, loc.input.sceneWidth + 1, y1 + 2, [200], color2, color);
                    });
                }
            }

            function drawBlackRails(loc) {
                if (loc.input.readOnly.s_showBlackRails) {
                    blackNoteIds.forEach(function (id, i) {
                        var x0 = blackNoteSpots[i] * loc.whiteWidth - loc.blackWidth + 2;
                        var x1 = x0 + 2 * loc.blackWidth - 3;
                        var y0 = loc.yEndOfPiano;
                        var y1 = loc.input.sceneHeight;
                        var color1 = hexToRgb(loc.input.readOnly.s_colorBlackRails2);
                        var color2 = hexToRgb(loc.input.readOnly.s_colorBlackRails3);
                        var color = (i - 1) % 5 === 0 || (i - 2) % 5 === 0 ? color1 : color2;
                        loc.input.drawRect(x0, y0, x1, y1, [id], color, color);
                    });
                }
            }

            function drawScene(input) {
                var whiteWidth = Math.floor(input.sceneWidth / whiteNoteIds.length);
                var maxRadius = Math.max.apply(null, input.readOnly.p_radiuses);
                var timePerSceneHeigth = input.sceneHeight / input.pixelsPerTime;
                var timeBarHeight = input.sceneHeight * maxRadius / timePerSceneHeigth;
                var yEndOfTimeBar = Math.floor(input.readOnly.s_showPiano ? 0.2 * input.sceneHeight : timeBarHeight);
                var loc = {
                    input: input,
                    whiteWidth: whiteWidth,
                    blackWidth: Math.round(0.25 * whiteWidth),
                    yEndOfTimeBar: yEndOfTimeBar,
                    yEndOfPiano: yEndOfTimeBar - timeBarHeight,
                    xRemainder: input.sceneWidth - whiteWidth * whiteNoteIds.length
                };
                drawSustainBackground(loc);
                drawBlackRails(loc);
                input.readOnly.s_views.forEach(function (view, i) {
                    if (view === "full") {
                        drawTrack(loc, i);
                    }
                });
                drawSustainNotes(loc);
                drawPiano(loc);
                drawTimeBar(loc);
                drawNoteCover(loc);
            }
            SceneFns.drawScene = drawScene;
        })(Game.SceneFns || (Game.SceneFns = {}));
        var SceneFns = Game.SceneFns;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (SceneFns) {
            var WebGL = (function () {
                function WebGL(canvas, attributes) {
                    this.attributes = attributes;
                    var o = this;
                    o.gl = WebGL.getContext(canvas);
                    o.gl.blendFunc(o.gl.SRC_ALPHA, o.gl.ONE_MINUS_SRC_ALPHA);
                    o.gl.enable(o.gl.BLEND);
                    o.gl.disable(o.gl.DEPTH_TEST);
                    o.initShaders();
                }
                WebGL.prototype.redraw = function (dx, dy, pressedNotes) {
                    var o = this;
                    o.gl.clear(o.gl.COLOR_BUFFER_BIT);
                    o.gl.uniform1f(o.udx, dx); // creates garbage! ca 200
                    o.gl.uniform1f(o.udy, dy); // creates garbage! ca 200
                    o.gl.uniform1iv(o.uactive, pressedNotes);
                    o.gl.drawArrays(o.gl.TRIANGLES, 0, o.attrLength);
                };

                WebGL.prototype.setBuffer = function (bufferData) {
                    var o = this;

                    var dims = 0;
                    o.attributes.forEach(function (attr) {
                        dims += attr.dim;
                    });
                    o.attrLength = bufferData.length / dims;

                    if (o.buffer) {
                        o.gl.deleteBuffer(o.buffer);
                    }
                    o.buffer = o.gl.createBuffer();
                    o.gl.bindBuffer(o.gl.ARRAY_BUFFER, o.buffer);
                    o.gl.bufferData(o.gl.ARRAY_BUFFER, bufferData, o.gl.STATIC_DRAW);
                    o.assignAttribPointers();
                };

                WebGL.prototype.setClearColor = function (rgba) {
                    var o = this;
                    o.gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
                };

                WebGL.prototype.initShaders = function () {
                    var o = this;

                    var vertexShader = o.getShader("scene/_assets/vertex.glsl");
                    var fragmentShader = o.getShader("scene/_assets/fragment.glsl");
                    var shaderProgram = this.gl.createProgram();
                    this.gl.attachShader(shaderProgram, vertexShader);
                    this.gl.attachShader(shaderProgram, fragmentShader);
                    this.gl.linkProgram(shaderProgram);
                    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
                        alert("Unable to initialize the shader program.");
                    }
                    this.gl.useProgram(shaderProgram);

                    o.udx = o.gl.getUniformLocation(shaderProgram, "u_dx");
                    o.udy = o.gl.getUniformLocation(shaderProgram, "u_dy");
                    o.uactive = o.gl.getUniformLocation(shaderProgram, "u_active");

                    o.attributeLocs = o.attributes.map(function (attr) {
                        return o.gl.getAttribLocation(shaderProgram, attr.name);
                    });
                    o.attributeLocs.forEach(function (attr) {
                        o.gl.enableVertexAttribArray(attr);
                    });
                };

                WebGL.prototype.assignAttribPointers = function () {
                    var o = this;
                    var pos = 0;
                    o.attributeLocs.forEach(function (loc, i) {
                        var dim = o.attributes[i].dim;
                        o.gl.vertexAttribPointer(loc, dim, o.gl.FLOAT, false, 44, pos);
                        pos += dim * 4;
                    });
                };

                WebGL.getContext = function (canvas) {
                    return canvas.getContext("experimental-webgl", { antialias: true });
                };

                WebGL.prototype.getShader = function (path) {
                    var o = this;
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', path, false);
                    xhr.send();
                    var shader;
                    if (path.indexOf("fragment.glsl") > 0) {
                        shader = o.gl.createShader(o.gl.FRAGMENT_SHADER);
                    } else if (path.indexOf("vertex.glsl") > 0) {
                        shader = o.gl.createShader(o.gl.VERTEX_SHADER);
                    }
                    o.gl.shaderSource(shader, xhr.responseText);
                    o.gl.compileShader(shader);
                    if (!o.gl.getShaderParameter(shader, o.gl.COMPILE_STATUS)) {
                        var lastError = o.gl.getShaderInfoLog(shader);
                        o.gl.deleteShader(shader);
                        alert("Error compiling shader '" + shader + "':" + lastError);
                    }
                    return shader;
                };
                return WebGL;
            })();
            SceneFns.WebGL = WebGL;
        })(Game.SceneFns || (Game.SceneFns = {}));
        var SceneFns = Game.SceneFns;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        function concat(arrays) {
            var result = (function () {
                var length = 0;
                arrays.forEach(function (a) {
                    length += a.length;
                });
                return new Float32Array(length);
            })();
            var pos = 0;
            arrays.forEach(function (a) {
                result.set(a, pos);
                pos += a.length;
            });
            return result;
        }

        var Scene = (function () {
            function Scene(song, params) {
                this.song = song;
                this.params = params;
                this.activeIds = new Int32Array(127);
                var o = this;
                o.subscribeToParamsChange();
                o.setBackgrColors();
                o.canvas = o.getCanvas();
                o.setCanvasDim();
                o.setupWebGL();
                o.setupScene();
            }
            Scene.prototype.setActiveId = function (id) {
                this.activeIds[id] = 1;
            };

            Scene.prototype.unsetActiveId = function (id) {
                this.activeIds[id] = 0;
            };

            Scene.prototype.unsetAllActiveIds = function () {
                for (var i = 0; i < this.activeIds.length; i++) {
                    this.activeIds[i] = 0;
                }
            };

            Scene.prototype.redraw = function (time, isPaused) {
                var o = this;
                o.setPausedState(isPaused);
                var dx = 2 * time / o.song.timePerSong;
                var dy = -time * o.pixelsPerTime / o.canvas.height * 2;
                o.webgl.redraw(dx, dy, o.activeIds);
            };

            Scene.prototype.subscribeToParamsChange = function () {
                var o = this;
                o.params.subscribe("scene.Basic", "^s_noteCoverRelHeight$", function (name, value) {
                    o.setupScene();
                });
            };

            Scene.prototype.setBackgrColors = function () {
                var o = this;
                o.pausedColor = new Int32Array(Musicope.Game.SceneFns.hexToRgb(o.params.readOnly.s_colPaused));
                o.unpausedColor = new Int32Array(Musicope.Game.SceneFns.hexToRgb(o.params.readOnly.s_colUnPaused));
            };

            Scene.prototype.setPausedState = function (isPaused) {
                var o = this;
                if (isPaused) {
                    o.webgl.setClearColor(o.pausedColor);
                } else {
                    o.webgl.setClearColor(o.unpausedColor);
                }
            };

            Scene.prototype.getCanvas = function () {
                var c = $("<canvas class='canvas' />").appendTo("body");
                c.css({ position: 'absolute', left: 0, top: 0 });
                return c[0];
            };

            Scene.prototype.setCanvasDim = function () {
                var o = this;
                o.canvas.width = window.innerWidth;
                o.canvas.height = window.innerHeight;
                o.pixelsPerTime = o.canvas.height * 4 / (o.song.noteValuePerBeat * o.params.readOnly.s_quartersPerHeight * o.song.timePerBeat);
                $(window).resize(function () {
                    o.canvas.width = window.innerWidth;
                    o.canvas.height = window.innerHeight;
                });
            };

            Scene.prototype.setupWebGL = function () {
                var o = this;
                var attributes = [
                    { name: "a_position", dim: 2 },
                    { name: "a_color", dim: 4 },
                    { name: "a_id", dim: 1 },
                    { name: "a_activeColor", dim: 4 }
                ];
                o.webgl = new Musicope.Game.SceneFns.WebGL(o.canvas, attributes);
            };

            Scene.prototype.setupScene = function () {
                var o = this;
                var bag = [];

                var input = {
                    drawRect: function (x0, y0, x1, y1, ids, color, activeColor) {
                        bag.push(o.rect(x0, y0, x1, y1, ids, [color], [activeColor]));
                    },
                    readOnly: o.params.readOnly,
                    pixelsPerTime: o.pixelsPerTime,
                    sceneWidth: o.canvas.width,
                    sceneHeight: o.canvas.height,
                    tracks: o.song.sceneTracks,
                    sustainNotes: o.song.sceneSustainNotes,
                    p_minNote: o.params.readOnly.p_minNote,
                    p_maxNote: o.params.readOnly.p_maxNote,
                    minPlayedNoteId: o.song.minPlayedNoteId,
                    maxPlayedNoteId: o.song.maxPlayedNoteId
                };
                Musicope.Game.SceneFns.drawScene(input);
                var bufferData = concat(bag);
                o.webgl.setBuffer(bufferData);
            };

            Scene.prototype.rect = function (x0, y0, x1, y1, ids, colors, activeColors) {
                var o = this;
                function fx(v) {
                    return v / o.canvas.width * 2 - 1;
                }
                function fy(v) {
                    return v / o.canvas.height * 2 - 1;
                }
                if (colors.length === 1) {
                    colors = [colors[0], colors[0], colors[0], colors[0]];
                }
                if (!activeColors) {
                    activeColors = colors;
                } else if (activeColors.length === 1) {
                    activeColors = [activeColors[0], activeColors[0], activeColors[0], activeColors[0]];
                }
                if (ids.length === 1) {
                    ids = [ids[0], ids[0], ids[0], ids[0]];
                }
                var out = new Float32Array([
                    fx(x0), fy(y0), colors[0][0], colors[0][1], colors[0][2], colors[0][3], ids[0], activeColors[0][0], activeColors[0][1], activeColors[0][2], activeColors[0][3],
                    fx(x1), fy(y0), colors[1][0], colors[1][1], colors[1][2], colors[1][3], ids[1], activeColors[1][0], activeColors[1][1], activeColors[1][2], activeColors[1][3],
                    fx(x1), fy(y1), colors[2][0], colors[2][1], colors[2][2], colors[2][3], ids[2], activeColors[2][0], activeColors[2][1], activeColors[2][2], activeColors[2][3],
                    fx(x0), fy(y0), colors[0][0], colors[0][1], colors[0][2], colors[0][3], ids[0], activeColors[0][0], activeColors[0][1], activeColors[0][2], activeColors[0][3],
                    fx(x1), fy(y1), colors[2][0], colors[2][1], colors[2][2], colors[2][3], ids[2], activeColors[2][0], activeColors[2][1], activeColors[2][2], activeColors[2][3],
                    fx(x0), fy(y1), colors[3][0], colors[3][1], colors[3][2], colors[3][3], ids[3], activeColors[3][0], activeColors[3][1], activeColors[3][2], activeColors[3][3]]);
                return out;
            };
            return Scene;
        })();
        Game.Scene = Scene;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        Game.defParams = {
            // controllers
            c_songUrl: undefined,
            c_idevice: "Jazz",
            c_callbackUrl: undefined,
            // players
            p_deviceIn: "0",
            p_deviceOut: "1",
            p_elapsedTime: undefined,
            p_initTime: undefined,
            p_isPaused: false,
            p_minNote: 36,
            p_maxNote: 96,
            p_playOutOfReachNotes: false,
            p_waitForOutOfReachNotes: true,
            p_radiuses: [200, 200],
            p_speed: 1,
            p_sustain: true,
            p_userHands: [false, false],
            p_volumes: [1, 1],
            p_waits: [true, true],
            p_maxVelocity: [90, 90],
            // metronomes
            m_channel: 153,
            m_id1: 60,
            m_id2: 56,
            m_isOn: true,
            m_ticksPerBeat: 1,
            m_velocity: 15,
            // parsers
            f_normalize: 60,
            f_trackIds: [1, 0],
            // scenes
            s_showPiano: true,
            s_showSustainBg: false,
            s_views: ["full", "full"],
            s_quartersPerHeight: 10,
            s_showBlackRails: true,
            s_noteCoverRelHeight: 0.0,
            s_colorBlackRails2: "#371313",
            s_colorBlackRails3: "#282200",
            s_colWhites: ["#ff5252", "#ffd800"],
            s_colBlacks: ["#b73f3f", "#a78d00"],
            s_colTime: "#0094ff",
            s_colPianoWhite: "#2c79b2",
            s_colPianoBlack: "#3faeff",
            s_colSustain: "#00ff90",
            s_colSustainBg: "#002f1a",
            s_colPaused: "#090714",
            s_colUnPaused: "#0d0c0c",
            s_colUnPlayedNotes: "#808080",
            s_colOutOfReachNotes: "#ff5252",
            s_colUnPlayedNotesInReach: "#00ff90"
        };
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    (function (Game) {
        var Params = (function () {
            function Params() {
                this.subscriptions = {};
                var o = this;
                o.readOnly = Musicope.Params.getUrlParams(Musicope.Game.defParams);
            }
            Params.prototype.subscribe = function (id, regex, callback) {
                var o = this;
                o.subscriptions[id] = {
                    regex: new RegExp(regex),
                    callback: callback
                };
            };

            Params.prototype.unsubscribe = function (id) {
                var o = this;
                delete o.subscriptions[id];
            };

            Params.prototype.setParam = function (name, value, dontNotifyOthers) {
                var o = this;
                o.readOnly[name] = value;
                if (!dontNotifyOthers) {
                    o.call(name, value);
                }
            };

            Params.prototype.areEqual = function (param1, param2) {
                if ("every" in param1 && "every" in param2) {
                    var areEqual = param1.every(function (param1i, i) {
                        return param1i == param2[i];
                    });
                    return areEqual;
                } else {
                    return param1 == param2;
                }
            };

            Params.prototype.call = function (param, value) {
                var o = this;
                for (var prop in o.subscriptions) {
                    var s = o.subscriptions[prop];
                    if (param.search(s["regex"]) > -1) {
                        s["callback"](param, value);
                    }
                }
            };
            return Params;
        })();
        Game.Params = Params;
    })(Musicope.Game || (Musicope.Game = {}));
    var Game = Musicope.Game;
})(Musicope || (Musicope = {}));
/*
* base64-arraybuffer
* https://github.com/niklasvh/base64-arraybuffer
*
* Copyright (c) 2012 Niklas von Hertzen
* Licensed under the MIT license.
*/
var Base64;
(function (Base64) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes) {
        var i, len = bytes.buffer.byteLength, base64 = "";

        for (i = 0; i < len; i += 3) {
            base64 += chars[bytes.buffer[i] >> 2];
            base64 += chars[((bytes.buffer[i] & 3) << 4) | (bytes.buffer[i + 1] >> 4)];
            base64 += chars[((bytes.buffer[i + 1] & 15) << 2) | (bytes.buffer[i + 2] >> 6)];
            base64 += chars[bytes.buffer[i + 2] & 63];
        }

        if ((len % 3) === 2) {
            base64 = base64.substring(0, base64.length - 1) + "=";
        } else if (len % 3 === 1) {
            base64 = base64.substring(0, base64.length - 2) + "==";
        }

        return base64;
    }
    Base64.encode = encode;
    ;

    function decode(base64) {
        var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;

        if (base64[base64.length - 1] === "=") {
            bufferLength--;
            if (base64[base64.length - 2] === "=") {
                bufferLength--;
            }
        }

        var arraybuffer = new ArrayBuffer(bufferLength);
        var bytes = new Uint8Array(arraybuffer);

        for (i = 0; i < len; i += 4) {
            encoded1 = chars.indexOf(base64[i]);
            encoded2 = chars.indexOf(base64[i + 1]);
            encoded3 = chars.indexOf(base64[i + 2]);
            encoded4 = chars.indexOf(base64[i + 3]);

            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }

        return bytes;
    }
    Base64.decode = decode;
    ;
})(Base64 || (Base64 = {}));
//# sourceMappingURL=app.js.map

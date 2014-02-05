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
//# sourceMappingURL=midiToJson.js.map

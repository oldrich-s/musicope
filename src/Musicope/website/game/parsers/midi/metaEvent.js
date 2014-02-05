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
//# sourceMappingURL=metaEvent.js.map

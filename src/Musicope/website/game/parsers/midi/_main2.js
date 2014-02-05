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
//# sourceMappingURL=_main2.js.map

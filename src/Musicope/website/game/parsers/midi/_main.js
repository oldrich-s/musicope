var Musicope;
(function (Musicope) {
    (function (Game) {
        (function (Parsers) {
            (function (_Midi) {
                var Midi = (function () {
                    function Midi(midi) {
                        this.midi = midi;
                        this.tracks = [];
                        this.sustainNotes = [];
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
//# sourceMappingURL=_main.js.map

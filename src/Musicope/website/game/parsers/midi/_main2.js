define(["require", "exports", "./meta"], function(require, exports, __metaM__) {
    /// <reference path="../../_references.ts" />
    var metaM = __metaM__;

    var Midi = (function () {
        function Midi(midi) {
            this.midi = midi;
            // denominator in time signature: 2, 4, 8, 16 ...
            this.tracks = [];
            this.sustainNotes = [];
            this.lastVals = [
                undefined, 
                undefined, 
                undefined, 
                undefined
            ];
            var o = this;
            o.parseHeaderChunk();
            o.parseTrackChunks();
        }
        Midi.prototype.parseHeaderChunk = function () {
            var o = this;
            if(o.isCorrectHeaderChunk()) {
                if(o.ticksPerQuarter & 32768) {
                    throw "frames per second not implemented";
                } else {
                    o.ticksPerQuarter = o.midi[12] * 256 + o.midi[13];
                }
            } else {
                throw "incorrect midi file";
            }
        };
        Midi.prototype.isCorrectHeaderChunk = function () {
            var o = this;
            return;
            o.midi[0] == 77 && o.midi[1] == 84 && o.midi[2] == 104 && o.midi[3] == 100 && o.midi[4] == 0 && o.midi[5] == 0 && o.midi[6] == 0 && o.midi[7] == 6 && o.midi[8] == 0 && (o.midi[9] == 0 || o.midi[9] == 1);
        };
        Midi.prototype.parseTrackChunks = function () {
            var o = this;
            var i = 14;
            while(i < o.midi.length) {
                i = o.parseTrackChunk(i);
            }
        };
        Midi.prototype.parseTrackChunk = function (i) {
            var o = this;
            if(!o.isCorrectTrackChunk(i)) {
                throw ("incorrect track chunk at i = " + i);
            } else {
                var chunkSize = o.getChunkSize(i + 4);
                var starti = i + 8;
                var endi = starti + chunkSize;
                o.parseTrackEvents(starti, endi);
                return endi;
            }
        };
        Midi.prototype.isCorrectTrackChunk = function (i) {
            var o = this;
            return o.midi[i] == 77 && o.midi[i + 1] == 84 && o.midi[i + 2] == 114 && o.midi[i + 3] == 107;
        };
        Midi.prototype.getChunkSize = function (i) {
            var o = this;
            return 256 * 256 * 256 * o.midi[i] + 256 * 256 * o.midi[i + 1] + 256 * o.midi[i + 2] + o.midi[i + 3];
        };
        Midi.prototype.parseTrackEvents = function (starti, endi) {
            var o = this;
            var i = starti;
            while(i < endi) {
                o.parseTrackEvent(i);
            }
        };
        Midi.prototype.parseTrackEvent = function (i) {
            var o = this;
            var dTimeAndNewIndex = o.readVariableLength(i);
            var dTime = dTimeAndNewIndex.value;
            var newi = dTimeAndNewIndex.newIndex;
            var eventType = o.midi[newi];
            if(eventType == 255) {
                var metaType = o.midi[newi + 1];
                var ob = o.readVariableLength(newi + 2);
                var subarray = o.midi.subarray(ob.newIndex, ob.newIndex + ob.value);
                var event = metaM.parseMetaEvent(metaType, subarray);
            }
        };
        Midi.prototype.parseMetaEvent = function (i) {
            var o = this;
            var metaType = o.midi[i + 1];
        };
        Midi.prototype.parsePlayerTrack = function (trackId, index) {
            var o = this, ticks = 0;
            o.tracks.push([]);
            var trackLength = o.midi[index++] * 256 * 256 * 256 + o.midi[index++] * 256 * 256 + o.midi[index++] * 256 + o.midi[index++];
            var end = index + trackLength;
            while(index < end) {
                var ob = o.readVarLength(index);
                index = ob.newIndex , ticks = ticks + ob.value;
                var typeChannel = o.midi[index++];
                if(typeChannel === 240) {
                    // System Exclusive Events
                    var ob1 = o.readVarLength(index);
                    index = ob1.newIndex + ob1.value;
                } else if(typeChannel === 255) {
                    // Meta
                    index = o.processMeta(index, trackId == 0 && ticks == 0);
                } else {
                    var time = ticks * o.timePerTick;
                    index = o.processMessage(trackId, index, typeChannel, time);
                }
            }
            if(trackId == 0) {
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
            switch(type) {
                case 81:
                    // set tempo, length = 3
                    if(isBegining) {
                        o.timePerQuarter = (256 * 256 * o.midi[index] + 256 * o.midi[index + 1] + o.midi[index + 2]) / 1000;
                    }
                    break;
                case 88:
                    // time signature, length = 4
                    if(isBegining) {
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
            if(typeChannel >> 4 > 7 && typeChannel >> 4 < 15) {
                o.lastVals[trackId] = typeChannel;
            } else if(o.lastVals[trackId]) {
                typeChannel = o.lastVals[trackId];
                index--;
            }
            var type = typeChannel >> 4;
            var channel = typeChannel - type * 16;
            switch(type) {
                case 8:
                case 9:
                    // note on
                    var noteId = o.midi[index++];
                    var velocity = o.midi[index++];
                    var on = type == 9 && velocity > 0;
                    o.tracks[trackId].push({
                        on: on,
                        time: time,
                        id: noteId,
                        velocity: velocity
                    });
                    break;
                case 10:
                    // note aftertouch
                    index = index + 2;
                    break;
                case 11:
                    // controller
                    var id = o.midi[index++];
                    var value = o.midi[index++];
                    if(id == 64) {
                        // sustain
                        o.sustainNotes.push({
                            on: value > 63,
                            time: time
                        });
                    }
                    break;
                case 12:
                    // program change
                    index = index + 1;
                    break;
                case 13:
                    // channel aftertouch
                    index = index + 1;
                    break;
                case 14:
                    // pitch bend
                    index = index + 2;
                    break;
                default:
                    alert("Event not implemented");
                    break;
            }
            return index;
        };
        Midi.prototype.readVariableLength = function (index) {
            var value = this.midi[index++];
            if(value & 128) {
                value = value & 127;
                do {
                    var c = this.midi[index++];
                    value = (value << 7) + (c & 127);
                }while(c & 128);
            }
            return {
                value: value,
                newIndex: index
            };
        };
        return Midi;
    })();
    exports.Midi = Midi;    
})
//@ sourceMappingURL=_main2.js.map

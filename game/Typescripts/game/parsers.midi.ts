module Musicope.Game.Parsers.Midi {

    interface IParser2 extends IParser {
        ticksPerQuarter: number;
        timePerQuarter: number;
        timePerTick: number;
        beatsPerBar: number;
        midi: Uint8Array;
        lastVals: number[];
    };

	function processMessage(o: IParser2, trackId: number, index: number, typeChannel: number, time: number) {
        if (typeChannel >> 4 > 7 && typeChannel >> 4 < 15) {
            o.lastVals[trackId] = typeChannel;
        } else if (o.lastVals[trackId]) {
            typeChannel = o.lastVals[trackId];
            index--;
        }

        var type = typeChannel >> 4;
        var channel = typeChannel - type * 16;

        switch (type) {
        case 8: // note off
        case 9: // note on
            var noteId = o.midi[index++];
            var velocity = o.midi[index++];
            var on = type == 9 && velocity > 0;
            o.tracks[trackId].push({ on: on, time: time, id: noteId, velocity: velocity });
            break;
        case 10: // note aftertouch
            index = index + 2;
            break;
        case 11: // controller
            var id = o.midi[index++];
            var value = o.midi[index++];
            if (id == 64) { // sustain
            o.sustainNotes.push({ on: value > 63, time: time });
            }
            break;
        case 12: // program change
            index = index + 1;
            break;
        case 13: // channel aftertouch
            index = index + 1;
            break;
        case 14: // pitch bend
            index = index + 2;
            break;
        default:
            alert("Event not implemented");
            break;
        }
        return index;
    }

    function readVarLength(midi: Uint8Array, index: number) {
        var value = midi[index++];
        if (value & 0x80) {
            value = value & 0x7F;
            do {
                var c = midi[index++];
                value = (value << 7) + (c & 0x7F);
            } while (c & 0x80);
        }
        return { value: value, newIndex: index };
    }

    function processMeta(o: IParser2, index: number, isBegining: boolean) {
        var kind = o.midi[index++];
        var ob = readVarLength(o.midi, index);
        index = ob.newIndex;
        switch (kind) {
            case 81: // set tempo, length = 3
                if (isBegining) {
                    o.timePerQuarter = (256 * 256 * o.midi[index] + 256 * o.midi[index + 1] + o.midi[index + 2]) / 1000;
                }
                break;
            case 88: // time signature, length = 4
                if (isBegining) {
                    o.beatsPerBar = o.midi[index];
                    o.noteValuePerBeat = Math.pow(2, o.midi[index + 1]);
                    var midiClocksPerMetronomeClick = o.midi[index + 2];
                    var thirtySecondsPer24Clocks = o.midi[index + 3];
                }
                break;
            case 0: // sequence number
            case 1: // text event
            case 2: // copyright notice
            case 3: // track name
            case 4: // instrument name
            case 5: // lyrics
            case 6: // marker
            case 7: // cue point
            case 32: // channel prefix
            case 33: // channel prefix or port
            case 47: // end of track
            case 84: // smpte offset
            case 89: // key signature
            case 127: // sequencer specific
            default:
                break;
        }
        return index + ob.value;
    }

    function parsePlayerTrack(o: IParser2, trackId: number, index: number) {
      var ticks = 0;
      o.tracks.push([]);
      var trackLength = o.midi[index++] * 256 * 256 * 256 + o.midi[index++] * 256 * 256 + o.midi[index++] * 256 + o.midi[index++];
      var end = index + trackLength;
      while (index < end) {
        var ob = readVarLength(o.midi, index);
        index = ob.newIndex, ticks = ticks + ob.value;
        var typeChannel = o.midi[index++];

        if (typeChannel === 240) { // System Exclusive Events
          var ob1 = readVarLength(o.midi, index);
          index = ob1.newIndex + ob1.value;
        } else if (typeChannel === 255) { // Meta
          index = processMeta(o, index, trackId == 0 && ticks == 0);
        } else {
          var time = ticks * o.timePerTick;
          index = processMessage(o, trackId, index, typeChannel, time);
        }
      }
      if (trackId == 0) {
        o.timePerBeat = o.timePerQuarter * 4 / o.noteValuePerBeat;
        o.timePerTick = o.timePerQuarter / o.ticksPerQuarter;
        o.timePerBar = o.timePerBeat * o.beatsPerBar;
      }
    }

    function indexesOf(where: Uint8Array, what: number[]) {
        var result: number[] = [];
        for (var i = 0; i < where.length; i++) {
            var found = what.every((whati, j) => {
                return whati == where[i + j];
            });
            if (found) { result.push(i); }
        }
        return result;
    }

    function parsePlayerTracks(o: IParser2) {
        var trackIndexes = indexesOf(o.midi, [77, 84, 114, 107]);
        trackIndexes.forEach((index, i) => {
            parsePlayerTrack(o, i, index + 4);
        });
        if (o.tracks[0].length == 0) {
            o.tracks.shift();
        }
    }

    function indexOf(where: Uint8Array, what: number[]) {
        for (var i = 0; i < where.length; i++) {
            var found = what.every((whati, j) => {
                return whati == where[i + j];
            });
            if (found) { return i; }
        }
        return -1;
    }

    function parseHeader(o: IParser2) {
        var i0 = indexOf(o.midi, [77, 84, 104, 100, 0, 0, 0, 6]);
        if (i0 == -1 || o.midi[i0 + 9] > 1) {
            throw "cannot parse midi";
        }
        o.ticksPerQuarter = o.midi[i0 + 12] * 256 + o.midi[i0 + 13];
        if (o.ticksPerQuarter & 0x8000) {
            alert("ticksPerBeat not implemented");
        }
    }

    export function parseMidi(midi: Uint8Array): IParser {
        var parser: IParser2 = {
            timePerBeat: 0,
            timePerBar: 0,
            noteValuePerBeat: 4, // denominator in time signature: 2, 4, 8, 16 ...
            tracks: [],
            sustainNotes: [],
            ticksPerQuarter: 0,
            timePerQuarter: 0,
            timePerTick: 0,
            beatsPerBar: 4,
            midi: midi,
            lastVals: []
        };
        parseHeader(parser);
        parsePlayerTracks(parser);
        return parser;
    }

}
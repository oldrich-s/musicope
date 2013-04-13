/// <reference path="../../_references.ts" />

import metaEventM = module("./metaEvent");
import midiEventM = module("./midiEvent");

interface ITrackEvent {
  name: string;
  value: any;
  dTime: number;
}

interface ITrackEvent2 extends ITrackEvent {
  newi: number;
}

function readVariableLength(arr: Uint8Array, i: number) {
  var value = arr[i++];
  if (value & 0x80) {
    value = value & 0x7F;
    do {
      var c = arr[i++];
      value = (value << 7) + (c & 0x7F);
    } while (c & 0x80);
  }
  return { value: value, newi: i };
}

function getChunkSize(arr: Uint8Array) {
  return 256 * 256 * 256 * arr[0] +
          256 * 256 * arr[1] +
          256 * arr[2] +
          arr[3];
}

function parseTrackEvent(arr: Uint8Array, i: number): ITrackEvent2 {
  var ob = readVariableLength(arr, i);
  var dTime = ob.value;
  i = ob.newi;
  var eventType = arr[i];
  switch (eventType) {
    case 240:
    case 247:
      var ob = readVariableLength(arr, i + 1);
      return {
        name: "sysEx",
        dTime: dTime,
        value: arr.subarray(ob.newi, ob.newi + ob.value),
        newi: ob.newi + ob.value
      };
    case 255:
      var metaType = arr[i + 1];
      var ob = readVariableLength(arr, i + 2);
      var subarray = arr.subarray(ob.newi, ob.newi + ob.value)
      var event = metaEventM.parse(metaType, subarray);
      return {
        name: "meta",
        dTime: dTime,
        value: event,
        newi: ob.newi + ob.value
      };
    default:
      return {
        name: "midi",
        dTime: dTime,
        value: midiEventM.parse(arr[i], arr[i+1], arr[i+2]),
        newi: i + 3
      };
  }
}

function parseTrackChunk(arr: Uint8Array) {
  var events: ITrackEvent[] = [];
  var i = 0;
  while (i < arr.length) {
    var res = parseTrackEvent(arr, i);
    events.push({ name: res.name, dTime: res.dTime, value: res.value });
    i = res.newi;
  }
  return {
    name: "track",
    value: events
  };
}

function isTrackChunk(arr: Uint8Array) {
  return arr[0] == 77 && arr[1] == 84 && arr[2] == 114 && arr[3] == 107;
}

function parseHeaderChunk(arr: Uint8Array) {
  var ticksPerQuarter = arr[4] * 256 + arr[5];
  if (ticksPerQuarter & 0x8000) {
    throw "frames per second not implemented";
  } else {
    return {
      name: "header",
      value: {
        format: 256 * arr[0] + arr[1],
        numberOfTracks: 256 * arr[2] + arr[3],
        ticksPerQuarter: ticksPerQuarter
      }
    };
  }
}

function isHeaderChunk(arr: Uint8Array) {
  return arr[0] == 77 && arr[1] == 84 && arr[2] == 104 && arr[3] == 100;
}

function getChunkParser(arr: Uint8Array): (arr: Uint8Array) => any {
  if (isHeaderChunk(arr)) { return parseHeaderChunk; }
  else if (isTrackChunk(arr)) { return parseTrackChunk; }
  else { throw "unknown chunk"; }
}

export function parse(arr: Uint8Array) {
  var chunks: any[] = [];
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
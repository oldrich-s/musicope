///// <reference path="../../_references.ts" />

//import metaM = module("./meta");

//interface ITrackEvent {
//  name: string;
//  value: any;
//}

//interface ITrackEvent2 extends ITrackEvent {
//  newi: number;
//}

//function readVariableLength(arr: Uint8Array, i: number) {
//  var value = arr[i++];
//  if (value & 0x80) {
//    value = value & 0x7F;
//    do {
//      var c = arr[i++];
//      value = (value << 7) + (c & 0x7F);
//    } while (c & 0x80);
//  }
//  return { value: value, newi: i };
//}

//function parsearrEvent(arr: Uint8Array, i: number) {
//  return {
//  };
//}

//function parseMetaEvent(arr: Uint8Array, i: number) {

//  var metaType = arr[i];
//  var ob = readVariableLength(arr, i + 1);
//  var subarray = arr.subarray(ob.newi, ob.newi + ob.value)
//  var event = metaM.parseMetaEvent(metaType, subarray);
//  return {
//    newi: ob.newi,
//    name: "meta",
//    value: event
//  };
//}

//function parseSysExEvent(arr: Uint8Array, i: number) {

//  var ob = readVariableLength(arr, i);
//  return {
//    newi: ob.newi,
//    name: "sysEx",
//    value: arr.subarray(i)
//  }
//}

//function parseTrackEvent(arr: Uint8Array, i: number): ITrackEvent2 {

//  var dTimeAndNewIndex = readVariableLength(arr, i);
//  var dTime = dTimeAndNewIndex.value;
//  var newi = dTimeAndNewIndex.newi;
//  var eventType = arr[newi];
//  switch (eventType) {
//    case 240:
//    case 247: return parseSysExEvent(arr, newi + 1);
//    case 255: return parseMetaEvent(arr, newi + 1);
//    default: return parsearrEvent(arr, newi + 1);
//  }
//}

//function parseTrackEvents(arr: Uint8Array) {

//  var events: ITrackEvent[] = [];
//  var i = 0;
//  while (i < arr.length) {
//    var res = parseTrackEvent(arr, i);
//    events.push({ name: res.name, value: res.value });
//    i = res.newi;
//  }
//  return events;
//}

//function getChunkSize(arr: Uint8Array) {
//  return 256 * 256 * 256 * arr[0] +
//          256 * 256 * arr[1] +
//          256 * arr[2] +
//          arr[3];
//}

//function parseChunk(arr: Uint8Array) {
//}

//function isCorrectHeaderChunk(arr: Uint8Array) {
//  return
//  arr[0] == 77 && arr[1] == 84 && arr[2] == 104 && arr[3] == 100 &&
//  arr[4] == 0 && arr[5] == 0 && arr[6] == 0 && arr[7] == 6 &&
//  arr[8] == 0 && (arr[9] == 0 || arr[9] == 1);
//}

//function getChunkFn(arr: Uint8Array) {
//  if (isCorrectHeaderChunk(arr)) {
//    return parseHeaderChunk;
//  } else if (isCorrectTrackChunk(arr)) {
//    return parseTrackChunk;
//  }
//}

//function parseChunks(arr: Uint8Array) {
//  var chunks: any[] = [];
//  var name = getChunkFn(arr.subarray(0,3));
//  while (i < arr.length) {
//    var ob = parseTrackChunk(i);
//    i = ob.newi;
//    trackChunks.push(ob.events);
//  }
//  return trackChunks;
//}

//function isCorrectTrackChunk(i: number) {
//  return arr[i] == 77 && arr[i + 1] == 84 &&
//         arr[i + 2] == 114 && arr[i + 3] == 107;
//}

//function parseTrackChunk(arr: Uint8Array, i: number) {

//  if (!isCorrectTrackChunk(i)) {
//    throw ("incorrect track chunk at i = " + i);
//  } else {
//    var chunkSize = getChunkSize(i + 4);
//    var subarray = arr.subarray(i + 8, i + 8 + chunkSize);
//    var events = parseTrackEvents(subarray);
//    return {
//      newi: endi,
//      events: events
//    };
//  }
//}

//function parseTrackChunks() {
//  var i = 14;
//  var trackChunks: ITrackEvent[][] = [];
//  while (i < arr.length) {
//    var ob = parseTrackChunk(i);
//    i = ob.newi;
//    trackChunks.push(ob.events);
//  }
//  return trackChunks;
//}

//function isCorrectHeaderChunk(arr: Uint8Array) {
//  return
//    arr[0] == 77 && arr[1] == 84 && arr[2] == 104 && arr[3] == 100 &&
//    arr[4] == 0 && arr[5] == 0 && arr[6] == 0 && arr[7] == 6 &&
//    arr[8] == 0 && (arr[9] == 0 || arr[9] == 1);
//}

//function parseHeaderChunk(arr: Uint8Array) {
//  if (isCorrectHeaderChunk(arr)) {
//    if (ticksPerQuarter & 0x8000) {
//      throw "frames per second not implemented";
//    } else {
//      ticksPerQuarter = arr[12] * 256 + arr[13];
//    }
//  } else {
//    throw "incorrect arr file";
//  }
//}

//export function arrToJson(arr: Uint8Array) {
//  return {
//    ticksPerQuarter: parseHeaderChunk(arr)
//  };
//  ;
//  return parseTrackChunks(arr);
//}
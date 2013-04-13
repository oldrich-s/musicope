function sequencerSpecific(arr: Uint8Array) { return arr; }

function keySignature(arr: Uint8Array) {
  return { key: arr[0], scale: arr[1] };
}

function timeSignature(arr: Uint8Array) {
  return { numer: arr[0], denom: arr[1], metro: arr[2], nds32: arr[3] };
}

function smpteOffset(arr: Uint8Array) {
  return { hour: arr[0], min: arr[1], sec: arr[2], fr: arr[3], subfr: arr[4] };
}

function setTempo(arr: Uint8Array) {
  return 256 * 256 * arr[0] + 256 * arr[1] + arr[2];
}

function endOfTrack(arr: Uint8Array) { return true; }

function midiChannelPrefix(arr: Uint8Array) {
  return arr[0];
}

function toText(arr: Uint8Array) {
  var text = "";
  for (var i = 0; i < arr.byteLength; i++) {
    text += String.fromCharCode(arr[i]);
  }
  return text;
}

function sequenceNumber(arr: Uint8Array) {
  return {
    MSB: arr[0],
    LSB: arr[1]
  };
}

var metaTypes = {
  0: { name: "sequenceNumber", fn: sequenceNumber },
  1: { name: "text", fn: toText },
  2: { name: "copyrightNotice", fn: toText },
  3: { name: "sequenceOrTrackName", fn: toText },
  4: { name: "InstrumentName", fn: toText },
  5: { name: "lyrics", fn: toText },
  6: { name: "marker", fn: toText },
  7: { name: "cuePoint", fn: toText },
  32: { name: "midiChannelPrefix", fn: midiChannelPrefix },
  47: { name: "endOfTrack", fn: endOfTrack },
  81: { name: "setTempo", fn: setTempo },
  84: { name: "smpteOffset", fn: smpteOffset },
  88: { name: "timeSignature", fn: timeSignature },
  89: { name: "keySignature", fn: keySignature },
  127: { name: "sequencerSpecific", fn: sequencerSpecific }
};

export function parse(metaType: number, arr: Uint8Array) {
  var event = metaTypes[metaType];
  return {
    name: <string> event["name"],
    value: event["fn"](arr)
  };
}
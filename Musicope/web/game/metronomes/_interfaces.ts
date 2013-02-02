/// <reference path="../_references.ts" />

interface IMetronome {
  params: IMetronomeParams;
  _init(timePerBeat: number, beatsPerBar: number, device: IDevice, params: IMetronomeParams): void;
  play(time: number);
  reset();
}
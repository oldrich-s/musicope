/// <reference path="../_references.ts" />

interface IMetronome {
  params: IMetronomeParams;
  play(time: number);
  reset();
}

interface IMetronomeNew {
  new(timePerBeat: number, beatsPerBar: number, device: IDevice, params: IMetronomeParams): IMetronome;
}
/// <reference path="../_references.ts" />

interface IMetronome {
  getParams(): IMetronomeParams;
  setParams(params: IMetronomeParams): void;
  play(time: number);
  reset();
}

interface IMetronomeNew {
  new(timePerBeat: number, beatsPerBar: number, device: IDevice, params: IMetronomeParams): IMetronome;
}
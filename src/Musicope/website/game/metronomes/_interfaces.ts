module Musicope.Game.Metronomes {

  export interface IMetronome {
    play(time: number);
    reset();
  }

  export interface IMetronomeNew {
    new (timePerBeat: number, beatsPerBar: number, device: IDevice, params: Params.IParams): IMetronome;
  }

}
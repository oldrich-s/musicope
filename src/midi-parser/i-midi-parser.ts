// time units = miliseconds

export interface INote {
    on: boolean;
    time: number;
    id: number;
    velocity: number;
}

export interface ISustainNote {
    on: boolean;
    time: number;
}

export interface ISignature {
    msecsPerBeat: number;
    beatsPerBar: number;
    noteValuePerBeat: number;
    msecsPerBar: number;
}

export interface IParser {
    ticksPerBeat: number;
    signatures: { [msecs: number]: ISignature };
    tracks: INote[][];
    sustainNotes: ISustainNote[];
};
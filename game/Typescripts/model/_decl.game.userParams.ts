module Musicope.Model.Game.UserParams {

    export interface INoteColors {
        blackNote: KnockoutObservable<string>;
        whiteNote: KnockoutObservable<string>;
    }

    export interface IColorsPiano {
        timeBar: KnockoutObservable<string>;
        pressedBlackNote: KnockoutObservable<string>;
        pressedWhiteNote: KnockoutObservable<string>;
        inReachInSongNotPlayedNote: KnockoutObservable<string>;
        outOfReachInSongPlayedNote: KnockoutObservable<string>;
        outOfReachInSongNotPlayedNote: KnockoutObservable<string>;
    };

    export interface IColorsBars {
        leftHand: INoteColors;
        rightHand: INoteColors;
        sustain: KnockoutObservable<string>;
        blackRails2: KnockoutObservable<string>;
        blackRails3: KnockoutObservable<string>;
    };

    export interface IColors {
        bars: IColorsBars;
        piano: IColorsPiano;
    };

    export interface IGraphics {
        showPiano: KnockoutObservable<boolean>;
        noteCoverRelHeight: KnockoutObservable<number>;
        quartersPerHeight: KnockoutObservable<number>;
        showBlackRails: KnockoutObservable<boolean>;
        colors: IColors;
    };

    export interface IMetronome {
        channel: KnockoutObservable<number>;
        noteID1: KnockoutObservable<number>;
        noteID2: KnockoutObservable<number>;
        isOn: KnockoutObservable<boolean>;
        ticksPerBeat: KnockoutObservable<number>;
        velocity: KnockoutObservable<number>;
    };

    export interface IMidi {
        driver: KnockoutObservable<string>;
        inputID: KnockoutObservable<string>;
        outputID: KnockoutObservable<string>;
        minNoteID: KnockoutObservable<number>;
        maxNoteID: KnockoutObservable<number>;
    };

} 
module Musicope.Model.Game {

    export interface IUserParams {
        songUrl: KnockoutObservable<string>;
        leftHandTrackID: KnockoutObservable<number>;
        rightHandTrackID: KnockoutObservable<number>;
        midi: UserParams.IMidi;
        pcPlaysOutOfReachNotes: KnockoutObservable<boolean>;
        initialElapsedTime: KnockoutObservable<number>;
        noteRecognitionBeforeDistance: KnockoutObservable<number>;
        noteRecognitionAfterDistance: KnockoutObservable<number>;
        pcPlaysSustain: KnockoutObservable<boolean>;
        pcPlaysLeftHand: KnockoutObservable<boolean>;
        pcPlaysRightHand: KnockoutObservable<boolean>;
        pcPlayedNoteVolumeScale: KnockoutObservable<number>;
        waitForLeftHand: KnockoutObservable<boolean>;
        waitForRightHand: KnockoutObservable<boolean>;
        metronome: UserParams.IMetronome;
        graphics: UserParams.IGraphics;
    };

    export interface IRuntime {
        elapsedTime: KnockoutObservable<number>;
        isPaused: KnockoutObservable<boolean>;
        songSpeed: KnockoutObservable<number>;
    }

} 
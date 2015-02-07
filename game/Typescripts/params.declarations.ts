module Musicope {

    export interface INoteColors {
        blackNote: KnockoutObservable<string>;
        whiteNote: KnockoutObservable<string>;
    }

    export interface IGameUserParams {
        songUrl: KnockoutObservable<string>;
        leftHandTrackID: KnockoutObservable<number>;
        rightHandTrackID: KnockoutObservable<number>;
        midi: {
            driver: KnockoutObservable<string>;
            inputID: KnockoutObservable<string>;
            outputID: KnockoutObservable<string>;
            minNoteID: KnockoutObservable<number>;
            maxNoteID: KnockoutObservable<number>;
        };
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
        metronome: {
            channel: KnockoutObservable<number>;
            noteID1: KnockoutObservable<number>;
            noteID2: KnockoutObservable<number>;
            isOn: KnockoutObservable<boolean>;
            ticksPerBeat: KnockoutObservable<number>;
            velocity: KnockoutObservable<number>;
        };
        graphics: {
            showPiano: KnockoutObservable<boolean>;
            noteCoverRelHeight: KnockoutObservable<number>;
            quartersPerHeight: KnockoutObservable<number>;
            showBlackRails: KnockoutObservable<boolean>;
            color: {
                bars: {
                    leftHand: INoteColors;
                    rightHand: INoteColors;
                    sustain: KnockoutObservable<string>;
                    blackRails2: KnockoutObservable<string>;
                    blackRails3: KnockoutObservable<string>;
                };
                piano: {
                    timeBar: KnockoutObservable<string>;
                    pressedBlackNote: KnockoutObservable<string>;
                    pressedWhiteNote: KnockoutObservable<string>;
                    inReachInSongNotPlayedNote: KnockoutObservable<string>;
                    outOfReachInSongPlayedNote: KnockoutObservable<string>;
                    outOfReachInSongNotPlayedNote: KnockoutObservable<string>;
                };
            };
        };
    };

    export interface IGameRuntime {
        elapsedTime: KnockoutObservable<number>;
        isPaused: KnockoutObservable<boolean>;
        songSpeed: KnockoutObservable<number>;
    }

    export interface IModel {

        game: {
            userParams: IGameUserParams;
        };

        p_maxVelocity: number[];
        f_normalize: number;
        
    }

} 
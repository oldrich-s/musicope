module Musicope {

    export interface IParams {

        // controllers
        c_songUrl: string;
        c_device: string;
        c_callbackUrl: string;

        // players
        p_deviceIn: string;
        p_deviceOut: string;
        p_elapsedTime: number;
        p_initTime: number;
        p_isPaused: boolean;
        p_minNote: number;
        p_maxNote: number;
        p_playOutOfReachNotes: boolean;
        p_waitForOutOfReachNotes: boolean;
        p_radiuses: number[];
        p_speed: number;
        p_sustain: boolean;
        p_userHands: boolean[];
        p_volumes: number[];
        p_waits: boolean[];
        p_maxVelocity: number[];

        // metronomes
        m_channel: number;
        m_id1: number;
        m_id2: number;
        m_isOn: boolean;
        m_ticksPerBeat: number;
        m_velocity: number;

        // scenes
        s_showSustainBg: boolean;
        s_showPiano: boolean;
        s_views: string[];
        s_noteCoverRelHeight: number;
        s_quartersPerHeight: number;
        s_showBlackRails: boolean;
        s_colorBlackRails2: string;
        s_colorBlackRails3: string;
        s_colWhites: string[];
        s_colBlacks: string[];
        s_colTime: string;
        s_colPianoWhite: string;
        s_colPianoBlack: string;
        s_colSustain: string;
        s_colSustainBg: string;
        s_colPaused: string;
        s_colUnPaused: string;
        s_colUnPlayedNotes: string;
        s_colOutOfReachNotes: string;
        s_colUnPlayedNotesInReach: string;

        // parsers
        f_normalize: number;
        f_trackIds: number[];
    }

} 
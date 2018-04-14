import { config, setParam } from "../../config/config"
import { Scene } from "../scene/scene"
import { INote } from "../midi-parser/i-midi-parser"

export class WaitForNote {

    private ids: number[]
    private notesPressedTime: (number | undefined)[][]
    private old_real_time = 0
    private old_error = 0

    constructor(private scene: Scene, private notes: INote[][], private onNoteOn: (func: (noteId: number) => void) => void) {
        const o = this
        o.assignIds()
        o.assignNotesPressedTime()
        onNoteOn(o.addNoteOnToKnownNotes)
    }

    isFreeze = () => {
        const o = this
        let freeze = false
        for (let trackId = 0; trackId < o.notes.length; trackId++) {
            const isWait = config.p_userHands[trackId] && config.p_waits[trackId]
            if (isWait) {
                while (!freeze && o.isIdBelowCurrentTimeMinusRadius(trackId, o.ids[trackId])) {
                    freeze = o.isNoteUnpressed(trackId, o.ids[trackId])
                    if (!freeze) { o.ids[trackId]++ }
                }
            }
        }
        return freeze
    }

    reset = (idsBelowCurrentTime: number[]) => {
        const o = this
        o.resetNotesPressedTime(idsBelowCurrentTime)
        idsBelowCurrentTime.forEach(o.setId)
    }

    private assignIds = () => {
        const o = this
        o.ids = o.notes.map(() => { return 0 })
    }

    private assignNotesPressedTime = () => {
        const o = this
        o.notesPressedTime = o.notes.map((notesi) => {
            const arr = []
            arr[notesi.length - 1] = undefined
            return arr
        })
    }

    private addNoteOnToKnownNotes = (noteId: number) => {
        const o = this
        const firstNullTime = o.getFirstNullPressedTime()
        for (let i = 0; i < config.p_userHands.length; i++) {
            if (config.p_userHands[i]) {
                let id = o.ids[i]
                while (o.isIdBelowFirstTimePlusThreshold(i, id, firstNullTime)) {
                    const note = o.notes[i][id]
                    if (note.on && !o.notesPressedTime[i][id] && note.id === noteId) {
                        o.notesPressedTime[i][id] = config.p_elapsedTime
                        o.modifySpeed(parseFloat(<any>o.notes[i][id].time), parseFloat(<any>config.p_elapsedTime))
                        o.scene.addUID(note.sceneNote.uid, i)
                        return
                    }
                    id++
                }
            }
        }
    }

    private getFirstNullPressedTime = () => {
        const o = this
        let minTime = 1e6
        for (let i = 0; i < config.p_userHands.length; i++) {
            if (config.p_userHands[i]) {
                let id = o.ids[i]
                while (o.notes[i][id] && (o.notesPressedTime[i][id] || !o.notes[i][id].on)) { id++ } // chyba
                if (o.notes[i][id]) {
                    minTime = Math.min(o.notes[i][id].time, minTime)
                }
            }
        }
        return minTime
    }

    private modifySpeed = (real_time: number, game_time: number) => {
        const o = this
        const allHands = config.p_userHands.indexOf(false) === -1
        if (config.p_adaptableSpeed && allHands && game_time > 0) {
            const error = real_time - game_time
            if (o.old_real_time !== null && Math.abs(real_time - o.old_real_time) > 200) {
                const Kp = 1 / 10000
                const Kd = 1 / 10
                const derror = Math.max(error - o.old_error, -400)
                const de_dt = derror / (real_time - o.old_real_time)
                const du = Kp * error + Kd * de_dt
                setParam("p_speed", config.p_speed + du)
                o.old_error = error
                o.old_real_time = real_time
            }
        }
    }

    private isIdBelowFirstTimePlusThreshold = (trackId: number, noteId: number, nullTime: number) => {
        const o = this
        return o.notes[trackId][noteId] &&
            o.notes[trackId][noteId].time < nullTime + 100
    }

    private resetNotesPressedTime = (idsBelowCurrentTime: number[]) => {
        const o = this
        for (let i = 0; i < idsBelowCurrentTime.length; i++) {
            for (let j = idsBelowCurrentTime[i] + 1; j < o.notesPressedTime[i].length; j++) {
                if (o.notesPressedTime[i][j]) {
                    o.notesPressedTime[i][j] = undefined
                }
            }
        }
    }

    private setId = (id: number, i: number) => {
        const o = this
        o.ids[i] = id + 1
    }

    private isIdBelowCurrentTimeMinusRadius = (trackId: number, noteId: number) => {
        const o = this
        return o.notes[trackId][noteId] &&
            o.notes[trackId][noteId].time < (config.p_elapsedTime || 0) - config.p_wait_ms
    }

    private isNoteUnpressed = (trackId: number, noteId: number) => {
        const o = this
        const note = o.notes[trackId][noteId]
        const wasPlayedByUser = o.notesPressedTime[trackId][noteId]
        let waitForOutOfReach = true
        if (!config.p_waitForOutOfReachNotes) {
            const isNoteAboveMin = note.id >= config.p_minNote
            const isNoteBelowMax = note.id <= config.p_maxNote
            waitForOutOfReach = isNoteAboveMin && isNoteBelowMax
        }
        return note.on && !wasPlayedByUser && waitForOutOfReach
    }

}
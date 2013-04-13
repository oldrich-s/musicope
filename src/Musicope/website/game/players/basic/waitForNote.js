define(["require", "exports"], function(require, exports) {
    /// <reference path="../../_references.ts" />
    var o;
    var WaitForNote = (function () {
        function WaitForNote(device, params, notes, onNoteOn) {
            this.device = device;
            this.params = params;
            this.notes = notes;
            this.onNoteOn = onNoteOn;
            o = this;
            o.assignIds();
            o.assignNotesPressedTime();
            onNoteOn(o.addNoteOnToKnownNotes);
        }
        WaitForNote.prototype.isFreeze = function () {
            var freeze = false;
            for(var trackId = 0; trackId < o.notes.length; trackId++) {
                var isWait = o.params.readOnly.p_userHands[trackId] && o.params.readOnly.p_waits[trackId];
                if(isWait) {
                    while(!freeze && o.isIdBelowCurrentTimeMinusRadius(trackId, o.ids[trackId])) {
                        freeze = o.isNoteUnpressed(trackId, o.ids[trackId]);
                        if(!freeze) {
                            o.ids[trackId]++;
                        }
                        ;
                    }
                }
            }
            return freeze;
        };
        WaitForNote.prototype.reset = function (idsBelowCurrentTime) {
            o.resetNotesPressedTime(idsBelowCurrentTime);
            idsBelowCurrentTime.forEach(o.setId);
        };
        WaitForNote.prototype.assignIds = function () {
            o.ids = o.notes.map(function () {
                return 0;
            });
        };
        WaitForNote.prototype.assignNotesPressedTime = function () {
            o.notesPressedTime = o.notes.map(function (notesi) {
                var arr = [];
                arr[notesi.length - 1] = undefined;
                return arr;
            });
        };
        WaitForNote.prototype.addNoteOnToKnownNotes = function (noteId) {
            for(var i = 0; i < o.params.readOnly.p_userHands.length; i++) {
                if(o.params.readOnly.p_userHands[i]) {
                    var id = o.ids[i];
                    while(o.isIdBelowCurrentTimePlusRadius(i, id)) {
                        var note = o.notes[i][id];
                        if(note.on && !o.notesPressedTime[i][id] && note.id === noteId) {
                            var radius = Math.abs(o.notes[i][id].time - o.params.readOnly.p_elapsedTime) - 50;
                            if(radius < o.params.readOnly.p_radiuses[i]) {
                                o.notesPressedTime[i][id] = o.params.readOnly.p_elapsedTime;
                                return;
                            }
                        }
                        id++;
                    }
                }
            }
        };
        WaitForNote.prototype.isIdBelowCurrentTimePlusRadius = function (trackId, noteId) {
            return o.notes[trackId][noteId] && o.notes[trackId][noteId].time < o.params.readOnly.p_elapsedTime + o.params.readOnly.p_radiuses[trackId];
        };
        WaitForNote.prototype.resetNotesPressedTime = function (idsBelowCurrentTime) {
            for(var i = 0; i < idsBelowCurrentTime.length; i++) {
                for(var j = idsBelowCurrentTime[i] + 1; j < o.notesPressedTime[i].length; j++) {
                    if(o.notesPressedTime[i][j]) {
                        o.notesPressedTime[i][j] = undefined;
                    }
                }
            }
        };
        WaitForNote.prototype.setId = function (id, i) {
            o.ids[i] = id + 1;
        };
        WaitForNote.prototype.isIdBelowCurrentTimeMinusRadius = function (trackId, noteId) {
            return o.notes[trackId][noteId] && o.notes[trackId][noteId].time < o.params.readOnly.p_elapsedTime - o.params.readOnly.p_radiuses[trackId];
        };
        WaitForNote.prototype.isNoteUnpressed = function (trackId, noteId) {
            var note = o.notes[trackId][noteId];
            var wasPlayedByUser = o.notesPressedTime[trackId][noteId];
            var waitForOutOfReach = true;
            if(!o.params.readOnly.p_waitForOutOfReachNotes) {
                var isNoteAboveMin = note.id >= o.params.readOnly.p_minNote;
                var isNoteBelowMax = note.id <= o.params.readOnly.p_maxNote;
                waitForOutOfReach = isNoteAboveMin && isNoteBelowMax;
            }
            return note.on && !wasPlayedByUser && waitForOutOfReach;
        };
        return WaitForNote;
    })();
    exports.WaitForNote = WaitForNote;    
})
//@ sourceMappingURL=waitForNote.js.map

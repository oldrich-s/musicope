;
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            Game.keyboardActions["backspace"] = {
                title: "Exit",
                description: "Exit the gameplay.",
                triggerAction: function (song) {
                    Musicope.mainView.router.back();
                },
                getCurrentState: function () {
                    return null;
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            Game.keyboardActions["esc"] = {
                title: "Exit",
                description: "Exit the gameplay.",
                triggerAction: function (song) {
                    Musicope.mainView.router.back();
                },
                getCurrentState: function () {
                    return null;
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (_Game) {
        var Game = (function () {
            function Game() {
                this.requestAnimationFrame = window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] || window["msRequestAnimationFrame"] || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
                var o = this;
                $('#listView').hide();
                $('#gameView').show();
                if (!Musicope.config.c_songUrl) {
                    throw "c_songUrl does not exist!";
                }
                else {
                    Musicope.webMidi.ready.done(function () {
                        o.init(o.getSong());
                    });
                }
            }
            Game.prototype.getSong = function () {
                var o = this;
                var data = io.readFileB64(Musicope.config.c_songUrl);
                if (data.length == 0) {
                    throw "error loading midi file";
                }
                return data;
            };
            Game.prototype.init = function (data) {
                var o = this;
                o.song = new _Game.Song(data);
                o.scene = new _Game.Scene(o.song);
                o.metronome = new _Game.Metronome(o.song.midi.timePerBeat, o.song.midi.timePerBar / o.song.midi.timePerBeat);
                o.player = new _Game.Player(o.song, o.metronome, o.scene);
                o.keyboard = new _Game.Keyboard(o.song);
                o.step();
            };
            Game.prototype.step = function () {
                var o = this;
                function _step() {
                    if ($('.canvas').is(':visible')) {
                        o.requestAnimationFrame.call(window, _step);
                        o.player.step();
                    }
                    else {
                        Musicope.webMidi.inClose();
                    }
                }
                _step();
            };
            return Game;
        })();
        _Game.Game = Game;
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Setup;
    (function (Setup) {
        function getValue(el) {
            if (el.attr('type') == 'checkbox') {
                return el[0].checked;
            }
            else {
                var v = el.val();
                var fl = parseFloat(v);
                return fl === NaN ? v : fl;
            }
        }
        function setValue(el, value) {
            if (el.attr('type') == 'checkbox') {
                el[0].checked = value;
            }
            else {
                el.val(value);
            }
        }
        function init() {
            var fileExists = io.existsFile(Musicope.setupJsonPath);
            if (fileExists) {
                var text = io.readFile(Musicope.setupJsonPath);
                Musicope.defaultConfig = JSON.parse(text);
            }
            for (var key in Musicope.defaultConfig) {
                if (typeof Musicope.defaultConfig[key] == "object") {
                    Musicope.defaultConfig[key].forEach(function (v, i) {
                        var el = $('#' + key + '_' + i);
                        if (el.length == 1) {
                            setValue(el, v);
                        }
                    });
                }
                else {
                    var el = $('#' + key);
                    if (el.length == 1) {
                        setValue(el, Musicope.defaultConfig[key]);
                    }
                }
            }
            $('.setupPage input').change(function (e) {
                var el = $(this);
                if (el.attr('id') in Musicope.defaultConfig) {
                    Musicope.defaultConfig[el.attr('id')] = getValue(el);
                    io.writeFile(Musicope.setupJsonPath, JSON.stringify(Musicope.defaultConfig, null, 4));
                }
                else {
                    var m = el.attr('id').match(/^(.+)_(\d)$/);
                    if (m.length == 3) {
                        if (m[1] in Musicope.defaultConfig) {
                            Musicope.defaultConfig[m[1]][parseInt(m[2])] = getValue(el);
                            io.writeFile(Musicope.setupJsonPath, JSON.stringify(Musicope.defaultConfig, null, 4));
                        }
                    }
                }
            });
        }
        Setup.init = init;
    })(Setup = Musicope.Setup || (Musicope.Setup = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var WebMidi = (function () {
        function WebMidi() {
            var _this = this;
            this.ready = $.Deferred();
            //inList = () => {
            //    return []; //this.midi.inputs;
            //}
            //outList = () => {
            //    return []; //this.midi.outputs;
            //}
            this.inOpen = function (callback) {
                var o = _this;
                o.input = o.midi.inputs.get(Musicope.config.p_deviceIn);
                if (o.input) {
                    o.input.onmidimessage = function (e) {
                        callback(e.timeStamp, e.data[0], e.data[1], e.data[2]);
                    };
                }
            };
            this.outOpen = function () {
                var o = _this;
                o.output = o.midi.outputs.get(Musicope.config.p_deviceOut);
                if (!o.output) {
                    o.output = o.midi.outputs.get(0);
                }
            };
            this.inClose = function () {
                var o = _this;
                if (o.input && o.input.value) {
                    o.input.value.onmidimessage = null;
                }
            };
            this.out = function (byte1, byte2, byte3) {
                var data = [byte1, byte2];
                if (typeof byte3 === "number") {
                    data.push(byte3);
                }
                _this.output.send(data);
            };
            var o = this;
            navigator.requestMIDIAccess().then(function (m) {
                o.midi = m;
                o.ready.resolve();
            }, function (msg) {
                o.ready.reject("Failed to get MIDI access - " + msg);
            });
        }
        return WebMidi;
    })();
    Musicope.WebMidi = WebMidi;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardOverlay;
        (function (KeyboardOverlay) {
            var oldTimeOut;
            function display(description, value) {
                var str;
                if (typeof value == "number") {
                    str = Math.round(1000 * value) / 1000;
                }
                else {
                    str = value;
                }
                $('.canvasInfoDesc').text(description + ": ");
                $('.canvasInfoValue').text(str);
                $('.canvasInfo').show();
                clearTimeout(oldTimeOut);
                oldTimeOut = setTimeout(function () {
                    $('.canvasInfo').hide();
                }, 5000);
            }
            KeyboardOverlay.display = display;
        })(KeyboardOverlay = Game.KeyboardOverlay || (Game.KeyboardOverlay = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            var states = [0.0, 0.2, 0.4, 0.6, 0.8];
            Game.keyboardActions["c"] = {
                title: "Cover notes",
                description: "Cover a part of the note bars to increase the difficulty level.",
                triggerAction: function () {
                    var height = Game.KeyboardTools.toggle(Musicope.config.s_noteCoverRelHeight, states);
                    Musicope.Params.setParam("s_noteCoverRelHeight", height);
                },
                getCurrentState: function () {
                    return Musicope.config.s_noteCoverRelHeight;
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            Game.keyboardActions["m"] = {
                title: "Metronome",
                description: "Toggle state of the metronome on/off",
                triggerAction: function () {
                    Musicope.Params.setParam("m_isOn", !Musicope.config.m_isOn);
                },
                getCurrentState: function () {
                    return Musicope.config.m_isOn ? "on" : "off";
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            Game.keyboardActions["left"] = {
                title: "Fast backward",
                description: "Fast backward the song by the amount of 2 beats.",
                triggerAction: function (song) {
                    var newTime = Musicope.config.p_elapsedTime - 2 * song.midi.timePerBeat;
                    var truncTime = Math.max(Musicope.config.p_initTime, newTime);
                    Musicope.Params.setParam("p_elapsedTime", truncTime);
                },
                getCurrentState: function () {
                    return Musicope.config.p_elapsedTime / 1000;
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            Game.keyboardActions["home"] = {
                title: "Rewind start",
                description: "Rewind the song back to the initial position.",
                triggerAction: function (song) {
                    Musicope.Params.setParam("p_elapsedTime", Musicope.config.p_initTime);
                },
                getCurrentState: function () {
                    return Musicope.config.p_elapsedTime / 1000;
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            Game.keyboardActions["space"] = {
                title: "Pause",
                description: "Pause / unpause the song playback.",
                triggerAction: function (song) {
                    Musicope.Params.setParam("p_isPaused", !Musicope.config.p_isPaused);
                },
                getCurrentState: function () {
                    return Musicope.config.p_isPaused ? "on" : "off";
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            Game.keyboardActions["down"] = {
                title: "Slow down",
                description: "Slow down the playback by 10 percent points.",
                triggerAction: function (song) {
                    Musicope.Params.setParam("p_speed", Musicope.config.p_speed - 0.1);
                },
                getCurrentState: function () {
                    return Musicope.config.p_speed * 100;
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            Game.keyboardActions["up"] = {
                title: "Speed up",
                description: "Speed up the playback by 10 percent points.",
                triggerAction: function (song) {
                    Musicope.Params.setParam("p_speed", Musicope.config.p_speed + 0.1);
                },
                getCurrentState: function () {
                    return Musicope.config.p_speed * 100;
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardTools;
        (function (KeyboardTools) {
            function areEqual(param1, param2) {
                if (typeof param1 === "object" && typeof param2 === "object" && "every" in param1 && "every" in param2) {
                    var areEqual = param1.every(function (param1i, i) {
                        return param1i == param2[i];
                    });
                    return areEqual;
                }
                else {
                    return param1 == param2;
                }
            }
            KeyboardTools.areEqual = areEqual;
            function toggle(currentOption, options) {
                for (var i = 0; i < options.length; i++) {
                    if (areEqual(currentOption, options[i])) {
                        return options[(i + 1) % options.length];
                    }
                }
            }
            KeyboardTools.toggle = toggle;
        })(KeyboardTools = Game.KeyboardTools || (Game.KeyboardTools = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            var options = [[false, false], [false, true], [true, false], [true, true]];
            var names = ["none", "right", "left", "both"];
            Game.keyboardActions["h"] = {
                title: "Hands",
                description: "Defines which hands are played by the user [no hands / right hand / left hand / both hands].",
                triggerAction: function (song) {
                    Musicope.Params.setParam("p_userHands", Game.KeyboardTools.toggle(Musicope.config.p_userHands, options));
                },
                getCurrentState: function () {
                    var i = options.indexOf(Musicope.config.p_userHands);
                    return names[i];
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            Game.keyboardActions["right"] = {
                title: "Fast forward",
                description: "Fast forward the song by the amount of 2 beats.",
                triggerAction: function (song) {
                    var newTime = Musicope.config.p_elapsedTime + 2 * song.midi.timePerBeat;
                    var truncTime = Math.min(song.timePerSong + 10, newTime);
                    Musicope.Params.setParam("p_elapsedTime", truncTime);
                },
                getCurrentState: function () {
                    return Musicope.config.p_elapsedTime / 1000;
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        $(document).ready(function () {
            var options = [[false, false], [true, true]];
            var names = ["off", "on"];
            Game.keyboardActions["w"] = {
                title: "Wait",
                description: "The song playback stops until the correct note is hit.",
                triggerAction: function (song) {
                    Musicope.Params.setParam("p_waits", Game.KeyboardTools.toggle(Musicope.config.p_waits, options));
                },
                getCurrentState: function () {
                    var i = options.indexOf(Musicope.config.p_waits);
                    return names[i];
                }
            };
        });
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        Game.keyboardActions = {};
        var Keyboard = (function () {
            function Keyboard(song) {
                this.song = song;
                var o = this;
                o.subscribeActions();
                $('.canvasInfo').hide();
            }
            Keyboard.prototype.subscribeActions = function () {
                var o = this;
                for (var key in Game.keyboardActions) {
                    Mousetrap.bind(key, function (action) {
                        action.triggerAction(o.song);
                        Game.KeyboardOverlay.display(action.title, action.getCurrentState());
                    }.bind(this, Game.keyboardActions[key]));
                }
            };
            return Keyboard;
        })();
        Game.Keyboard = Keyboard;
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var Metronome = (function () {
            function Metronome(timePerBeat, beatsPerBar) {
                var _this = this;
                this.timePerBeat = timePerBeat;
                this.beatsPerBar = beatsPerBar;
                this.lastPlayedId = -10000;
                this.play = function (time) {
                    var o = _this;
                    if (Musicope.config.m_isOn) {
                        var id = Math.floor(Musicope.config.m_ticksPerBeat * time / o.timePerBeat);
                        if (id > o.lastPlayedId) {
                            var noteId = id % o.beatsPerBar == 0 ? Musicope.config.m_id1 : Musicope.config.m_id2;
                            var velocity = Math.min(127, Musicope.config.m_velocity);
                            Musicope.webMidi.out(Musicope.config.m_channel, noteId, velocity);
                            o.lastPlayedId = id;
                        }
                    }
                };
                this.reset = function () {
                    var o = _this;
                    o.lastPlayedId = -10000;
                };
                var o = this;
                o.subscribe();
            }
            Metronome.prototype.subscribe = function () {
                var o = this;
                Musicope.Params.subscribe("metronome", "^m_.+$", function (name, value) {
                    o.reset();
                });
            };
            return Metronome;
        })();
        Game.Metronome = Metronome;
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Params;
    (function (Params) {
        var subscriptions = {};
        function call(param, value) {
            for (var prop in subscriptions) {
                var s = subscriptions[prop];
                if (param.search(s["regex"]) > -1) {
                    s["callback"](param, value);
                }
            }
        }
        function reset() {
            subscriptions = {};
        }
        Params.reset = reset;
        function subscribe(id, regex, callback) {
            subscriptions[id] = {
                regex: new RegExp(regex),
                callback: callback
            };
        }
        Params.subscribe = subscribe;
        function setParam(name, value, dontNotifyOthers) {
            Musicope.config[name] = value;
            if (!dontNotifyOthers) {
                call(name, value);
            }
        }
        Params.setParam = setParam;
        function areEqual(param1, param2) {
            if ("every" in param1 && "every" in param2) {
                var areEqual = param1.every(function (param1i, i) {
                    return param1i == param2[i];
                });
                return areEqual;
            }
            else {
                return param1 == param2;
            }
        }
        Params.areEqual = areEqual;
    })(Params = Musicope.Params || (Musicope.Params = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var Parsers;
        (function (Parsers) {
            var Midi;
            (function (Midi) {
                ;
                function processMessage(o, v, time) {
                    switch (v.subtype) {
                        case "noteOn":
                        case "noteOff":
                            o.tracks[o.tracks.length - 1].push({
                                on: v.subtype == "noteOn",
                                time: time,
                                id: v.noteNumber,
                                velocity: v.velocity
                            });
                            break;
                        case "controller":
                            if (v.controllerType == 64) {
                                o.sustainNotes.push({ on: v.value > 63, time: time });
                            }
                            break;
                    }
                }
                function processMeta(o, v) {
                    switch (v.subtype) {
                        case "setTempo":
                            o.timePerQuarter = v.microsecondsPerBeat / 1000;
                            break;
                        case "timeSignature":
                            o.beatsPerBar = v.numerator;
                            o.noteValuePerBeat = v.denominator;
                            break;
                    }
                }
                function parsePlayerTrack(o, track) {
                    var ticks = 0;
                    o.tracks.push([]);
                    track.forEach(function (v) {
                        ticks = ticks + v.deltaTime;
                        if (v.type == "meta") {
                            processMeta(o, v);
                        }
                        else if (v.type == "channel") {
                            if (o.timePerBeat == 0) {
                                o.timePerBeat = o.timePerQuarter * 4 / o.noteValuePerBeat;
                                o.timePerTick = o.timePerQuarter / o.ticksPerQuarter;
                                o.timePerBar = o.timePerBeat * o.beatsPerBar;
                            }
                            var time = ticks * o.timePerTick;
                            processMessage(o, v, time);
                        }
                    });
                }
                function parsePlayerTracks(midi, o) {
                    midi.tracks.forEach(function (track, i) {
                        parsePlayerTrack(o, track);
                    });
                    if (o.tracks[0].length == 0) {
                        o.tracks.shift();
                    }
                }
                function parseHeader(midi, o) {
                    o.ticksPerQuarter = midi.header.ticksPerBeat;
                }
                function parseMidi(midi) {
                    var midiFile = MidiFile(atob(midi));
                    var parser = {
                        timePerBeat: 0,
                        timePerBar: 0,
                        noteValuePerBeat: 4,
                        tracks: [],
                        sustainNotes: [],
                        ticksPerQuarter: 0,
                        timePerQuarter: 500,
                        timePerTick: 0,
                        beatsPerBar: 4
                    };
                    parseHeader(midiFile, parser);
                    parsePlayerTracks(midiFile, parser);
                    return parser;
                }
                Midi.parseMidi = parseMidi;
            })(Midi = Parsers.Midi || (Parsers.Midi = {}));
        })(Parsers = Game.Parsers || (Game.Parsers = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        function hideTimeBarIfStops(scene, isFreeze) {
            if (isFreeze) {
                scene.setActiveId(2);
                scene.setActiveId(1);
            }
            else {
                scene.unsetActiveId(2);
                scene.unsetActiveId(1);
            }
        }
        function driverOnNotesToOff() {
            for (var i = 0; i < 128; i++) {
                Musicope.webMidi.out(144, i, 0);
            }
        }
        function getIdBelowCurrentTime(notes) {
            if (notes.length > 0) {
                var id = notes.length - 1;
                while (id >= 0 && notes[id] && notes[id].time > Musicope.config.p_elapsedTime) {
                    id--;
                }
                return id;
            }
        }
        function getIdsBelowCurrentTime(playerTracks) {
            return playerTracks.map(getIdBelowCurrentTime);
        }
        function correctTimesInParams(timePerBar) {
            if (typeof Musicope.config.p_initTime == 'undefined') {
                Musicope.Params.setParam("p_initTime", -2 * timePerBar);
            }
            if (typeof Musicope.config.p_elapsedTime == 'undefined') {
                Musicope.Params.setParam("p_elapsedTime", Musicope.config.p_initTime);
            }
        }
        var Player = (function () {
            function Player(song, metronome, scene) {
                var _this = this;
                this.song = song;
                this.metronome = metronome;
                this.scene = scene;
                this.step = function () {
                    var o = _this;
                    o.playNotes.play();
                    o.playSustains.play();
                    o.metronome.play(Musicope.config.p_elapsedTime);
                    o.scene.redraw(Musicope.config.p_elapsedTime, Musicope.config.p_isPaused);
                    var isFreeze = o.waitForNote.isFreeze();
                    hideTimeBarIfStops(o.scene, isFreeze);
                    return o.updateTime(isFreeze);
                };
                this.subscribeToParamsChange = function () {
                    var o = _this;
                    Musicope.Params.subscribe("players.Basic", "^p_elapsedTime$", function (name, value) {
                        o.reset();
                    });
                };
                this.reset = function () {
                    var o = _this;
                    o.scene.unsetAllActiveIds();
                    o.metronome.reset();
                    var idsBelowCurrentTime = getIdsBelowCurrentTime(o.song.midi.tracks);
                    o.waitForNote.reset(idsBelowCurrentTime);
                    o.playNotes.reset(idsBelowCurrentTime);
                    driverOnNotesToOff();
                };
                this.assignClasses = function () {
                    var o = _this;
                    o.fromDevice = new Game.PlayerFns.FromDevice(o.scene, o.song.midi.tracks);
                    o.playNotes = new Game.PlayerFns.PlayNotes(o.scene, o.song.midi.tracks);
                    o.playSustains = new Game.PlayerFns.PlaySustains(o.song.midi.sustainNotes);
                    o.waitForNote = new Game.PlayerFns.WaitForNote(o.song.midi.tracks, o.fromDevice.onNoteOn);
                };
                this.updateTime = function (isFreeze) {
                    var o = _this;
                    var currentTime = Date.now();
                    if (!o.previousTime) {
                        o.previousTime = currentTime;
                    }
                    var duration = currentTime - o.previousTime;
                    o.previousTime = currentTime;
                    var isSongEnd = Musicope.config.p_elapsedTime > o.song.timePerSong + 1000;
                    var doFreezeTime = isSongEnd || Musicope.config.p_isPaused || isFreeze || duration > 100; /*window was out of focus*/
                    if (!doFreezeTime) {
                        var newElapsedTime = Musicope.config.p_elapsedTime + Musicope.config.p_speed * duration;
                        Musicope.Params.setParam("p_elapsedTime", newElapsedTime, true);
                    }
                    return isSongEnd;
                };
                var o = this;
                o = this;
                correctTimesInParams(o.song.midi.timePerBar);
                o.subscribeToParamsChange();
                o.assignClasses();
            }
            return Player;
        })();
        Game.Player = Player;
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var PlayerFns;
        (function (PlayerFns) {
            function sendBackToDevice(kind, noteId, velocity) {
                if (kind < 242 && (kind < 127 || kind > 160)) {
                    Musicope.webMidi.out(kind, noteId, velocity);
                }
            }
            function execNoteOnFuncs(noteOnFuncs, noteId) {
                for (var i = 0; i < noteOnFuncs.length; i++) {
                    noteOnFuncs[i](noteId);
                }
            }
            var FromDevice = (function () {
                function FromDevice(scene, notes) {
                    var _this = this;
                    this.scene = scene;
                    this.notes = notes;
                    this.noteOnFuncs = [];
                    this.oldTimeStamp = -1;
                    this.oldVelocity = -1;
                    this.oldId = -1;
                    this.onNoteOn = function (func) {
                        var o = _this;
                        o.noteOnFuncs.push(func);
                    };
                    this.deviceIn = function (timeStamp, kind, noteId, velocity) {
                        var o = _this;
                        sendBackToDevice(kind, noteId, velocity);
                        var isNoteOn = kind === 144 && velocity > 0;
                        var isNoteOff = kind === 128 || (kind === 144 && velocity == 0);
                        if (isNoteOn && !o.isDoubleNote(timeStamp, isNoteOn, noteId, velocity)) {
                            o.scene.setActiveId(noteId);
                            execNoteOnFuncs(o.noteOnFuncs, noteId);
                        }
                        else if (isNoteOff) {
                            o.scene.unsetActiveId(noteId);
                        }
                    };
                    this.isDoubleNote = function (timeStamp, isNoteOn, noteId, velocity) {
                        var o = _this;
                        var isSimilarTime = Math.abs(timeStamp - o.oldTimeStamp) < 3;
                        var idMaches = Math.abs(noteId - o.oldId) == 12 || Math.abs(noteId - o.oldId) == 24;
                        var isDoubleNote = isSimilarTime && idMaches && velocity == o.oldVelocity;
                        o.oldTimeStamp = timeStamp;
                        o.oldVelocity = velocity;
                        o.oldId = noteId;
                        return isDoubleNote;
                    };
                    var o = this;
                    Musicope.webMidi.outOpen();
                    Musicope.webMidi.out(0x80, 0, 0);
                    Musicope.webMidi.inOpen(o.deviceIn);
                }
                return FromDevice;
            })();
            PlayerFns.FromDevice = FromDevice;
        })(PlayerFns = Game.PlayerFns || (Game.PlayerFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var PlayerFns;
        (function (PlayerFns) {
            var PlayNotes = (function () {
                function PlayNotes(scene, notes) {
                    var _this = this;
                    this.scene = scene;
                    this.notes = notes;
                    this.play = function () {
                        var o = _this;
                        for (var trackId = 0; trackId < o.notes.length; trackId++) {
                            while (o.isIdBelowCurrentTime(trackId)) {
                                var note = o.notes[trackId][o.ids[trackId]];
                                o.playNote(note, trackId);
                                o.ids[trackId]++;
                            }
                        }
                    };
                    this.reset = function (idsBelowCurrentTime) {
                        var o = _this;
                        for (var i = 0; i < idsBelowCurrentTime.length; i++) {
                            o.ids[i] = Math.max(0, idsBelowCurrentTime[i]);
                        }
                    };
                    this.assignIds = function () {
                        var o = _this;
                        o.ids = o.notes.map(function () {
                            return 0;
                        });
                    };
                    this.isIdBelowCurrentTime = function (trackId) {
                        var o = _this;
                        return o.notes[trackId][o.ids[trackId]] && o.notes[trackId][o.ids[trackId]].time < Musicope.config.p_elapsedTime;
                    };
                    this.playNote = function (note, trackId) {
                        var o = _this;
                        var playsUser = Musicope.config.p_userHands[trackId];
                        if (!playsUser || o.playOutOfReach(note)) {
                            if (note.on) {
                                Musicope.webMidi.out(144, note.id, Math.min(127, o.getVelocity(trackId, note)));
                                o.scene.setActiveId(note.id);
                            }
                            else {
                                Musicope.webMidi.out(144, note.id, 0);
                                o.scene.unsetActiveId(note.id);
                            }
                        }
                    };
                    this.playOutOfReach = function (note) {
                        var o = _this;
                        var isBelowMin = note.id < Musicope.config.p_minNote;
                        var isAboveMax = note.id > Musicope.config.p_maxNote;
                        Musicope.config.p_playOutOfReachNotes && (isBelowMin || isAboveMax);
                    };
                    this.getVelocity = function (trackId, note) {
                        var o = _this;
                        var velocity = Musicope.config.p_volumes[trackId] * note.velocity;
                        var maxVelocity = Musicope.config.p_maxVelocity[trackId];
                        if (maxVelocity && velocity > maxVelocity) {
                            velocity = maxVelocity;
                        }
                        return velocity;
                    };
                    var o = this;
                    o.assignIds();
                }
                return PlayNotes;
            })();
            PlayerFns.PlayNotes = PlayNotes;
        })(PlayerFns = Game.PlayerFns || (Game.PlayerFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var PlayerFns;
        (function (PlayerFns) {
            function isIdBelowCurrentTime(sustainNotes, id) {
                return sustainNotes[id] && sustainNotes[id].time < Musicope.config.p_elapsedTime;
            }
            function playSustainNote(note) {
                if (Musicope.config.p_sustain) {
                    if (note.on) {
                        Musicope.webMidi.out(176, 64, 127);
                    }
                    else {
                        Musicope.webMidi.out(176, 64, 0);
                    }
                }
            }
            var PlaySustains = (function () {
                function PlaySustains(sustainNotes) {
                    var _this = this;
                    this.sustainNotes = sustainNotes;
                    this.id = 0;
                    this.play = function () {
                        var o = _this;
                        while (isIdBelowCurrentTime(o.sustainNotes, o.id)) {
                            playSustainNote(o.sustainNotes[o.id]);
                            o.id++;
                        }
                    };
                    var o = this;
                }
                return PlaySustains;
            })();
            PlayerFns.PlaySustains = PlaySustains;
        })(PlayerFns = Game.PlayerFns || (Game.PlayerFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var PlayerFns;
        (function (PlayerFns) {
            var WaitForNote = (function () {
                function WaitForNote(notes, onNoteOn) {
                    var _this = this;
                    this.notes = notes;
                    this.onNoteOn = onNoteOn;
                    this.isFreeze = function () {
                        var o = _this;
                        var freeze = false;
                        for (var trackId = 0; trackId < o.notes.length; trackId++) {
                            var isWait = Musicope.config.p_userHands[trackId] && Musicope.config.p_waits[trackId];
                            if (isWait) {
                                while (!freeze && o.isIdBelowCurrentTimeMinusRadius(trackId, o.ids[trackId])) {
                                    freeze = o.isNoteUnpressed(trackId, o.ids[trackId]);
                                    if (!freeze) {
                                        o.ids[trackId]++;
                                    }
                                    ;
                                }
                            }
                        }
                        return freeze;
                    };
                    this.reset = function (idsBelowCurrentTime) {
                        var o = _this;
                        o.resetNotesPressedTime(idsBelowCurrentTime);
                        idsBelowCurrentTime.forEach(o.setId);
                    };
                    this.assignIds = function () {
                        var o = _this;
                        o.ids = o.notes.map(function () {
                            return 0;
                        });
                    };
                    this.assignNotesPressedTime = function () {
                        var o = _this;
                        o.notesPressedTime = o.notes.map(function (notesi) {
                            var arr = [];
                            arr[notesi.length - 1] = undefined;
                            return arr;
                        });
                    };
                    this.addNoteOnToKnownNotes = function (noteId) {
                        var o = _this;
                        for (var i = 0; i < Musicope.config.p_userHands.length; i++) {
                            if (Musicope.config.p_userHands[i]) {
                                var id = o.ids[i];
                                while (o.isIdBelowCurrentTimePlusRadius(i, id)) {
                                    var note = o.notes[i][id];
                                    if (note.on && !o.notesPressedTime[i][id] && note.id === noteId) {
                                        var radius = Math.abs(o.notes[i][id].time - Musicope.config.p_elapsedTime) - 50;
                                        if (radius < Musicope.config.p_radiuses[i]) {
                                            o.notesPressedTime[i][id] = Musicope.config.p_elapsedTime;
                                            return;
                                        }
                                    }
                                    id++;
                                }
                            }
                        }
                    };
                    this.isIdBelowCurrentTimePlusRadius = function (trackId, noteId) {
                        var o = _this;
                        return o.notes[trackId][noteId] && o.notes[trackId][noteId].time < Musicope.config.p_elapsedTime + Musicope.config.p_radiuses[trackId];
                    };
                    this.resetNotesPressedTime = function (idsBelowCurrentTime) {
                        var o = _this;
                        for (var i = 0; i < idsBelowCurrentTime.length; i++) {
                            for (var j = idsBelowCurrentTime[i] + 1; j < o.notesPressedTime[i].length; j++) {
                                if (o.notesPressedTime[i][j]) {
                                    o.notesPressedTime[i][j] = undefined;
                                }
                            }
                        }
                    };
                    this.setId = function (id, i) {
                        var o = _this;
                        o.ids[i] = id + 1;
                    };
                    this.isIdBelowCurrentTimeMinusRadius = function (trackId, noteId) {
                        var o = _this;
                        return o.notes[trackId][noteId] && o.notes[trackId][noteId].time < Musicope.config.p_elapsedTime - Musicope.config.p_radiuses[trackId];
                    };
                    this.isNoteUnpressed = function (trackId, noteId) {
                        var o = _this;
                        var note = o.notes[trackId][noteId];
                        var wasPlayedByUser = o.notesPressedTime[trackId][noteId];
                        var waitForOutOfReach = true;
                        if (!Musicope.config.p_waitForOutOfReachNotes) {
                            var isNoteAboveMin = note.id >= Musicope.config.p_minNote;
                            var isNoteBelowMax = note.id <= Musicope.config.p_maxNote;
                            waitForOutOfReach = isNoteAboveMin && isNoteBelowMax;
                        }
                        return note.on && !wasPlayedByUser && waitForOutOfReach;
                    };
                    var o = this;
                    o.assignIds();
                    o.assignNotesPressedTime();
                    onNoteOn(o.addNoteOnToKnownNotes);
                }
                return WaitForNote;
            })();
            PlayerFns.WaitForNote = WaitForNote;
        })(PlayerFns = Game.PlayerFns || (Game.PlayerFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        function concat(arrays) {
            var result = (function () {
                var length = 0;
                arrays.forEach(function (a) {
                    length += a.length;
                });
                return new Float32Array(length);
            })();
            var pos = 0;
            arrays.forEach(function (a) {
                result.set(a, pos);
                pos += a.length;
            });
            return result;
        }
        var Scene = (function () {
            function Scene(song) {
                this.song = song;
                this.activeIds = new Int32Array(127);
                var o = this;
                o.subscribeToParamsChange();
                o.setBackgrColors();
                o.canvas = $(".canvas")[0];
                o.setCanvasDim();
                o.setupWebGL();
                o.setupScene();
            }
            Scene.prototype.setActiveId = function (id) {
                this.activeIds[id] = 1;
            };
            Scene.prototype.unsetActiveId = function (id) {
                this.activeIds[id] = 0;
            };
            Scene.prototype.unsetAllActiveIds = function () {
                for (var i = 0; i < this.activeIds.length; i++) {
                    this.activeIds[i] = 0;
                }
            };
            Scene.prototype.redraw = function (time, isPaused) {
                var o = this;
                o.setPausedState(isPaused);
                var dx = 2 * time / o.song.timePerSong;
                var dy = -time * o.pixelsPerTime / o.canvas.height * 2;
                o.webgl.redraw(dx, dy, o.activeIds);
            };
            Scene.prototype.subscribeToParamsChange = function () {
                var o = this;
                Musicope.Params.subscribe("scene.Basic", "^s_noteCoverRelHeight$", function (name, value) {
                    o.setupScene();
                });
            };
            Scene.prototype.setBackgrColors = function () {
                var o = this;
                o.pausedColor = new Int32Array(Game.SceneFns.hexToRgb(Musicope.config.s_colPaused));
                o.unpausedColor = new Int32Array(Game.SceneFns.hexToRgb(Musicope.config.s_colUnPaused));
            };
            Scene.prototype.setPausedState = function (isPaused) {
                var o = this;
                if (isPaused) {
                    o.webgl.setClearColor(o.pausedColor);
                }
                else {
                    o.webgl.setClearColor(o.unpausedColor);
                }
            };
            Scene.prototype.setCanvasDim = function () {
                var o = this;
                o.canvas.width = window.innerWidth;
                o.canvas.height = window.innerHeight;
                o.pixelsPerTime = o.canvas.height * 4 / (o.song.midi.noteValuePerBeat * Musicope.config.s_quartersPerHeight * o.song.midi.timePerBeat);
            };
            Scene.prototype.setupWebGL = function () {
                var o = this;
                var attributes = [
                    { name: "a_position", dim: 2 },
                    { name: "a_color", dim: 4 },
                    { name: "a_id", dim: 1 },
                    { name: "a_activeColor", dim: 4 }
                ];
                o.webgl = new Game.SceneFns.WebGL(o.canvas, attributes);
            };
            Scene.prototype.setupScene = function () {
                var o = this;
                var bag = [];
                var input = {
                    drawRect: function (x0, y0, x1, y1, ids, color, activeColor) {
                        bag.push(o.rect(x0, y0, x1, y1, ids, [color], [activeColor]));
                    },
                    pixelsPerTime: o.pixelsPerTime,
                    sceneWidth: o.canvas.width,
                    sceneHeight: o.canvas.height,
                    tracks: o.song.sceneTracks,
                    sustainNotes: o.song.sceneSustainNotes,
                    p_minNote: Musicope.config.p_minNote,
                    p_maxNote: Musicope.config.p_maxNote,
                    timePerBar: o.song.midi.timePerBar,
                    playedNoteID: o.song.playedNoteID,
                };
                Game.SceneFns.drawScene(input);
                var bufferData = concat(bag);
                o.webgl.setBuffer(bufferData);
            };
            Scene.prototype.rect = function (x0, y0, x1, y1, ids, colors, activeColors) {
                var o = this;
                function fx(v) {
                    return v / o.canvas.width * 2 - 1;
                }
                function fy(v) {
                    return v / o.canvas.height * 2 - 1;
                }
                if (colors.length === 1) {
                    colors = [colors[0], colors[0], colors[0], colors[0]];
                }
                if (!activeColors) {
                    activeColors = colors;
                }
                else if (activeColors.length === 1) {
                    activeColors = [activeColors[0], activeColors[0], activeColors[0], activeColors[0]];
                }
                if (ids.length === 1) {
                    ids = [ids[0], ids[0], ids[0], ids[0]];
                }
                var out = new Float32Array([fx(x0), fy(y0), colors[0][0], colors[0][1], colors[0][2], colors[0][3], ids[0], activeColors[0][0], activeColors[0][1], activeColors[0][2], activeColors[0][3], fx(x1), fy(y0), colors[1][0], colors[1][1], colors[1][2], colors[1][3], ids[1], activeColors[1][0], activeColors[1][1], activeColors[1][2], activeColors[1][3], fx(x1), fy(y1), colors[2][0], colors[2][1], colors[2][2], colors[2][3], ids[2], activeColors[2][0], activeColors[2][1], activeColors[2][2], activeColors[2][3], fx(x0), fy(y0), colors[0][0], colors[0][1], colors[0][2], colors[0][3], ids[0], activeColors[0][0], activeColors[0][1], activeColors[0][2], activeColors[0][3], fx(x1), fy(y1), colors[2][0], colors[2][1], colors[2][2], colors[2][3], ids[2], activeColors[2][0], activeColors[2][1], activeColors[2][2], activeColors[2][3], fx(x0), fy(y1), colors[3][0], colors[3][1], colors[3][2], colors[3][3], ids[3], activeColors[3][0], activeColors[3][1], activeColors[3][2], activeColors[3][3]]);
                return out;
            };
            return Scene;
        })();
        Game.Scene = Scene;
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var SceneFns;
        (function (SceneFns) {
            // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
            function hexToRgb(hex, alpha) {
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                    return (r + r + g + g + b + b);
                });
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255, alpha || 1];
            }
            SceneFns.hexToRgb = hexToRgb;
            var whiteNoteIds = [
                21,
                23,
                24,
                26,
                28,
                29,
                31,
                33,
                35,
                36,
                38,
                40,
                41,
                43,
                45,
                47,
                48,
                50,
                52,
                53,
                55,
                57,
                59,
                60,
                62,
                64,
                65,
                67,
                69,
                71,
                72,
                74,
                76,
                77,
                79,
                81,
                83,
                84,
                86,
                88,
                89,
                91,
                93,
                95,
                96,
                98,
                100,
                101,
                103,
                105,
                107,
                108
            ];
            var blackNoteIds = [
                22,
                25,
                27,
                30,
                32,
                34,
                37,
                39,
                42,
                44,
                46,
                49,
                51,
                54,
                56,
                58,
                61,
                63,
                66,
                68,
                70,
                73,
                75,
                78,
                80,
                82,
                85,
                87,
                90,
                92,
                94,
                97,
                99,
                102,
                104,
                106
            ];
            var blackNoteSpots = [
                1,
                3,
                4,
                6,
                7,
                8,
                10,
                11,
                13,
                14,
                15,
                17,
                18,
                20,
                21,
                22,
                24,
                25,
                27,
                28,
                29,
                31,
                32,
                34,
                35,
                36,
                38,
                39,
                41,
                42,
                43,
                45,
                46,
                48,
                49,
                50
            ];
            var colors = [
                "#FA0B0C",
                "#F44712",
                "#F88010",
                "#F5D23B",
                "#B5B502",
                "#149033",
                "#1B9081",
                "#7D6AFD",
                "#A840FD",
                "#7F087C",
                "#A61586",
                "#D71386"
            ];
            var cLineColor = "#808080";
            function drawNoteCover(loc) {
                if (Musicope.config.s_noteCoverRelHeight > 0.0) {
                    var y0 = loc.yEndOfTimeBar;
                    var y1 = y0 + Musicope.config.s_noteCoverRelHeight * (loc.input.sceneHeight - loc.yEndOfTimeBar);
                    var color = [0, 0, 0, 1];
                    var activeColor = [0, 0, 0, 0.5];
                    loc.input.drawRect(0, y0, loc.input.sceneWidth + 1, y1, [1], color, activeColor);
                }
            }
            function drawPianoBlackNotes(loc) {
                blackNoteIds.forEach(function (id, i) {
                    var x0 = blackNoteSpots[i] * loc.whiteWidth - loc.blackWidth + 2;
                    var x1 = x0 + 2 * loc.blackWidth - 3;
                    var y0 = Math.floor(loc.yEndOfPiano * 0.4);
                    var y1 = loc.yEndOfPiano - 2;
                    var activeColor = hexToRgb(Musicope.config.s_colPianoBlack);
                    loc.input.drawRect(x0, y0, x1, y1, [id], [0, 0, 0, 1], activeColor);
                });
            }
            function getColorForWhitePianoNotes(id, loc) {
                var unPressedColor = [1, 1, 1, 1];
                var neverPlayedNote = id < loc.input.playedNoteID.min || id > loc.input.playedNoteID.max;
                var outOfReachNote = id < loc.input.p_minNote || id > loc.input.p_maxNote;
                var color;
                if (neverPlayedNote && !outOfReachNote) {
                    var notPlayedColor = hexToRgb(Musicope.config.s_colUnPlayedNotesInReach);
                    color = notPlayedColor;
                }
                else if (neverPlayedNote) {
                    var notPlayedColor = hexToRgb(Musicope.config.s_colUnPlayedNotes);
                    color = notPlayedColor;
                }
                else if (outOfReachNote) {
                    var outOfReachColor = hexToRgb(Musicope.config.s_colOutOfReachNotes);
                    color = outOfReachColor;
                }
                else {
                    color = unPressedColor;
                }
                return color;
            }
            function drawPianoWhiteNotes(loc) {
                whiteNoteIds.forEach(function (id, i) {
                    var x0 = i * loc.whiteWidth;
                    var x1 = x0 + loc.whiteWidth - 1;
                    var y0 = 12;
                    var y1 = loc.yEndOfPiano - 2;
                    var color = getColorForWhitePianoNotes(id, loc);
                    var activeColor = hexToRgb(Musicope.config.s_colPianoWhite);
                    loc.input.drawRect(x0, y0, x1, y1, [id], color, activeColor);
                });
            }
            function drawPianoTimeBarColor(loc) {
                var color = hexToRgb(Musicope.config.s_colTime, 0.9);
                var activeColor = hexToRgb(Musicope.config.s_colTime, 0.4);
                var y0 = loc.yEndOfPiano;
                var y1 = loc.yEndOfTimeBar;
                loc.input.drawRect(0, y0, 1, y1, [1, 2, 2, 1], color, activeColor);
            }
            function drawPianoTimeBarWhite(loc) {
                var y0 = loc.yEndOfPiano;
                var y1 = loc.yEndOfTimeBar;
                var color = [1, 1, 1, 0.9];
                var activeColor = [1, 1, 1, 0.4];
                loc.input.drawRect(0, y0, loc.input.sceneWidth, y1, [2, 1, 1, 2], color, activeColor);
                loc.input.drawRect(0, y1, loc.input.sceneWidth, 2 * y1 - y0, [3, 3, 3, 3], [0, 1, 0, 0.3], activeColor);
            }
            function drawPianoBackBlack(loc) {
                var y1 = loc.yEndOfPiano;
                loc.input.drawRect(0, 0, loc.input.sceneWidth + 1, y1, [150], [0, 0, 0, 1], [0, 0, 0, 1]);
            }
            function drawTimeBar(loc) {
                drawPianoTimeBarWhite(loc);
                drawPianoTimeBarColor(loc);
            }
            function drawPiano(loc) {
                if (Musicope.config.s_showPiano) {
                    drawPianoBackBlack(loc);
                    drawPianoWhiteNotes(loc);
                    drawPianoBlackNotes(loc);
                }
            }
            function drawSustainNotes(loc) {
                var color = hexToRgb(Musicope.config.s_colSustain);
                loc.input.sustainNotes.forEach(function (note) {
                    var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 1;
                    var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
                    var ipos = whiteNoteIds.length;
                    var x0 = ipos * loc.whiteWidth + 3;
                    var x1 = x0 + loc.whiteWidth - 5;
                    loc.input.drawRect(x0, y0, x1, y1, [200], color, color);
                });
            }
            function getColorByVelocity(color, velocity, minMaxVel) {
                if (Math.abs(minMaxVel[1] - minMaxVel[0]) > 10) {
                    var out = [];
                    var scale = 0.6 + 0.4 * (velocity - minMaxVel[0]) / (minMaxVel[1] - minMaxVel[0]);
                    out.push(scale * color[0]);
                    out.push(scale * color[1]);
                    out.push(scale * color[2]);
                    out.push(color[3]);
                    return out;
                }
                else {
                    return color;
                }
            }
            function getMinMaxVelocity(notes) {
                var max = 0, min = 200;
                notes.forEach(function (note) {
                    max = Math.max(max, note.velocityOn);
                    min = Math.min(min, note.velocityOn);
                });
                return [min, max];
            }
            function drawTrack(loc, trackId) {
                var minMaxVel = getMinMaxVelocity(loc.input.tracks[trackId]);
                var white = hexToRgb("#ffffff");
                loc.input.tracks[trackId].forEach(function (note) {
                    var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 1;
                    var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
                    var ipos = whiteNoteIds.indexOf(note.id);
                    var color = hexToRgb(colors[note.id % 12]);
                    if (ipos >= 0) {
                        var f = trackId == 0 ? 4 : 0;
                        var x0 = ipos * loc.whiteWidth + 3;
                        var x1 = x0 + loc.whiteWidth - 5;
                        //var color = getColorByVelocity(whiteNoteColor, note.velocityOn, minMaxVel);
                        loc.input.drawRect(x0, y0, x1, y1, [trackId + 200], white, white);
                        loc.input.drawRect(x0 + f, y0, x1 - f, y1, [trackId + 200], color, color);
                    }
                    else {
                        var f = trackId == 0 ? 3 : 0;
                        var pos = blackNoteIds.indexOf(note.id);
                        if (pos >= 0) {
                            var x0 = blackNoteSpots[pos] * loc.whiteWidth - loc.blackWidth + 2;
                            var x1 = x0 + 2 * loc.blackWidth - 3;
                            //var color = getColorByVelocity(blackNoteColor, note.velocityOn, minMaxVel);
                            loc.input.drawRect(x0, y0, x1, y1, [trackId + 202], white, white);
                            loc.input.drawRect(x0 + f, y0, x1 - f, y1, [trackId + 202], color, color);
                        }
                    }
                });
            }
            function drawBarLines(loc) {
                var maxTime = 0;
                loc.input.tracks.forEach(function (t) {
                    if (t.length > 0) {
                        maxTime = Math.max(t[t.length - 1].timeOff, maxTime);
                    }
                });
                var color = hexToRgb(cLineColor);
                var i = 0;
                while (true) {
                    var time = loc.input.timePerBar * i;
                    var y = loc.yEndOfTimeBar + loc.input.pixelsPerTime * time;
                    if (time > maxTime) {
                        break;
                    }
                    var x1 = (whiteNoteIds.length + 1) * loc.whiteWidth;
                    loc.input.drawRect(0, y, x1, y + 1, [200], color, color);
                    i++;
                }
            }
            function drawCLines(loc) {
                var color = hexToRgb(cLineColor);
                whiteNoteIds.forEach(function (id, i) {
                    if (id % 12 == 0) {
                        var x0 = i * loc.whiteWidth;
                        var y0 = loc.yEndOfPiano;
                        var y1 = loc.input.sceneHeight;
                        loc.input.drawRect(x0, y0, x0 + 1, y1, [id], color, color);
                    }
                });
            }
            function drawScene(input) {
                var whiteWidth = Math.floor(input.sceneWidth / whiteNoteIds.length);
                var maxRadius = Math.max.apply(null, Musicope.config.p_radiuses);
                var timePerSceneHeigth = input.sceneHeight / input.pixelsPerTime;
                var timeBarHeight = input.sceneHeight * maxRadius / timePerSceneHeigth;
                var yEndOfTimeBar = Math.floor(Musicope.config.s_showPiano ? 0.2 * input.sceneHeight : timeBarHeight);
                var loc = {
                    input: input,
                    whiteWidth: whiteWidth,
                    blackWidth: Math.round(0.25 * whiteWidth),
                    yEndOfTimeBar: yEndOfTimeBar,
                    yEndOfPiano: yEndOfTimeBar - timeBarHeight,
                    xRemainder: input.sceneWidth - whiteWidth * whiteNoteIds.length,
                };
                drawCLines(loc);
                drawBarLines(loc);
                Musicope.config.s_views.forEach(function (view, i) {
                    if (view === "full") {
                        drawTrack(loc, i);
                    }
                });
                drawSustainNotes(loc);
                drawPiano(loc);
                drawTimeBar(loc);
                drawNoteCover(loc);
            }
            SceneFns.drawScene = drawScene;
        })(SceneFns = Game.SceneFns || (Game.SceneFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var SceneFns;
        (function (SceneFns) {
            var WebGL = (function () {
                function WebGL(canvas, attributes) {
                    this.attributes = attributes;
                    var o = this;
                    o.gl = WebGL.getContext(canvas);
                    o.gl.blendFunc(o.gl.SRC_ALPHA, o.gl.ONE_MINUS_SRC_ALPHA);
                    o.gl.enable(o.gl.BLEND);
                    o.gl.disable(o.gl.DEPTH_TEST);
                    o.initShaders();
                }
                WebGL.prototype.redraw = function (dx, dy, pressedNotes) {
                    var o = this;
                    o.gl.clear(o.gl.COLOR_BUFFER_BIT);
                    o.gl.uniform1f(o.udx, dx); // creates garbage! ca 200
                    o.gl.uniform1f(o.udy, dy); // creates garbage! ca 200
                    o.gl.uniform1iv(o.uactive, pressedNotes);
                    o.gl.drawArrays(o.gl.TRIANGLES, 0, o.attrLength);
                };
                WebGL.prototype.setBuffer = function (bufferData) {
                    var o = this;
                    var dims = 0;
                    o.attributes.forEach(function (attr) {
                        dims += attr.dim;
                    });
                    o.attrLength = bufferData.length / dims;
                    if (o.buffer) {
                        o.gl.deleteBuffer(o.buffer);
                    }
                    o.buffer = o.gl.createBuffer();
                    o.gl.bindBuffer(o.gl.ARRAY_BUFFER, o.buffer);
                    o.gl.bufferData(o.gl.ARRAY_BUFFER, bufferData, o.gl.STATIC_DRAW);
                    o.assignAttribPointers();
                };
                WebGL.prototype.setClearColor = function (rgba) {
                    var o = this;
                    o.gl.clearColor(rgba[0], rgba[1], rgba[2], rgba[3]);
                };
                WebGL.prototype.initShaders = function () {
                    var o = this;
                    var vertexShader = o.getShader(".vertex");
                    var fragmentShader = o.getShader(".fragment");
                    var shaderProgram = this.gl.createProgram();
                    this.gl.attachShader(shaderProgram, vertexShader);
                    this.gl.attachShader(shaderProgram, fragmentShader);
                    this.gl.linkProgram(shaderProgram);
                    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
                        alert("Unable to initialize the shader program.");
                    }
                    this.gl.useProgram(shaderProgram);
                    o.udx = o.gl.getUniformLocation(shaderProgram, "u_dx");
                    o.udy = o.gl.getUniformLocation(shaderProgram, "u_dy");
                    o.uactive = o.gl.getUniformLocation(shaderProgram, "u_active");
                    o.attributeLocs = o.attributes.map(function (attr) {
                        return o.gl.getAttribLocation(shaderProgram, attr.name);
                    });
                    o.attributeLocs.forEach(function (attr) {
                        o.gl.enableVertexAttribArray(attr);
                    });
                };
                WebGL.prototype.assignAttribPointers = function () {
                    var o = this;
                    var pos = 0;
                    o.attributeLocs.forEach(function (loc, i) {
                        var dim = o.attributes[i].dim;
                        o.gl.vertexAttribPointer(loc, dim, o.gl.FLOAT, false, 44, pos);
                        pos += dim * 4;
                    });
                };
                WebGL.getContext = function (canvas) {
                    return canvas.getContext("experimental-webgl", { antialias: true });
                };
                WebGL.prototype.getShader = function (id) {
                    var o = this;
                    var shader;
                    if (id === ".fragment") {
                        shader = o.gl.createShader(o.gl.FRAGMENT_SHADER);
                    }
                    else if (id === ".vertex") {
                        shader = o.gl.createShader(o.gl.VERTEX_SHADER);
                    }
                    o.gl.shaderSource(shader, $(id).text().trim());
                    o.gl.compileShader(shader);
                    if (!o.gl.getShaderParameter(shader, o.gl.COMPILE_STATUS)) {
                        var lastError = o.gl.getShaderInfoLog(shader);
                        o.gl.deleteShader(shader);
                        alert("Error compiling shader '" + shader + "':" + lastError);
                    }
                    return shader;
                };
                return WebGL;
            })();
            SceneFns.WebGL = WebGL;
        })(SceneFns = Game.SceneFns || (Game.SceneFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        function computeTimePerSong(playerTracks) {
            var timePerSong = 0;
            playerTracks.forEach(function (notes) {
                notes.forEach(function (note) {
                    if (note.time > timePerSong) {
                        timePerSong = note.time;
                    }
                });
            });
            return timePerSong;
        }
        function computeCleanedPlayerTracks(sceneTracks) {
            var playerTracks = sceneTracks.map(function (sceneNotes) {
                var notesPlayer = [];
                sceneNotes.forEach(function (note) {
                    notesPlayer.push({ on: true, time: note.timeOn, id: note.id, velocity: note.velocityOn });
                    notesPlayer.push({ on: false, time: note.timeOff, id: note.id, velocity: note.velocityOff });
                });
                return notesPlayer.sort(function (a, b) {
                    var dt = a.time - b.time;
                    if (dt !== 0) {
                        return dt;
                    }
                    else {
                        return a.on ? 1 : -1;
                    }
                });
            });
            return playerTracks;
        }
        function getMinMaxNoteId(sceneTracks) {
            var min = 1e6, max = -1e6;
            sceneTracks.forEach(function (notes) {
                notes.forEach(function (note) {
                    max = Math.max(note.id, max);
                    min = Math.min(note.id, min);
                });
            });
            return { min: min, max: max };
        }
        function getSceneNote(noteOn, noteOff) {
            return {
                timeOn: noteOn.time,
                timeOff: noteOff.time,
                id: noteOn.id,
                velocityOn: noteOn.velocity,
                velocityOff: noteOff.velocity
            };
        }
        function computeSceneTracks(playerTracks) {
            var sceneTracks = playerTracks.map(function (playerNotes) {
                var sceneNotes = [], tempNotes = {};
                playerNotes.forEach(function (note, i) {
                    if (note.on) {
                        if (tempNotes[note.id]) {
                            var noteScene = getSceneNote(tempNotes[note.id], note);
                            sceneNotes.push(noteScene);
                        }
                        tempNotes[note.id] = note;
                    }
                    else {
                        var tn = tempNotes[note.id];
                        if (tn) {
                            var noteScene = getSceneNote(tempNotes[note.id], note);
                            sceneNotes.push(noteScene);
                            tempNotes[note.id] = undefined;
                        }
                    }
                });
                return sceneNotes;
            });
            return sceneTracks;
        }
        function computeSceneSustainNotes(sustainNotes) {
            var sceneSustainNotes = [];
            var tempNote;
            sustainNotes.forEach(function (note) {
                if (note.on) {
                    if (tempNote) {
                        sceneSustainNotes.push({ timeOn: tempNote.time, timeOff: note.time });
                    }
                    tempNote = note;
                }
                else if (tempNote) {
                    sceneSustainNotes.push({ timeOn: tempNote.time, timeOff: note.time });
                    tempNote = undefined;
                }
            });
            return sceneSustainNotes;
        }
        function filterSustainNotes(sustainNotes) {
            var last = false;
            var filteredNotes = sustainNotes.filter(function (note) {
                var isok = (note.on && !last) || (!note.on && last);
                last = note.on;
                return isok;
            });
            return filteredNotes;
        }
        function getMeanVelocity(playerTracks) {
            var sumVelocity = 0, n = 0;
            playerTracks.forEach(function (notes) {
                notes.forEach(function (note) {
                    if (note.on) {
                        n = n + 1;
                        sumVelocity += note.velocity;
                    }
                });
            });
            return sumVelocity / n;
        }
        function normalizeVolumeOfPlayerTracks(playerTracks) {
            if (Musicope.config.f_normalize) {
                var meanVel = getMeanVelocity(playerTracks);
                var scaleVel = Musicope.config.f_normalize / meanVel;
                if (scaleVel < 1.0) {
                    playerTracks.forEach(function (notes) {
                        notes.forEach(function (note) {
                            var limitVel = Math.min(127, scaleVel * note.velocity);
                            note.velocity = Math.max(0, limitVel);
                        });
                    });
                }
            }
        }
        function sortPlayerTracksByHands(playerTracks) {
            return Musicope.config.f_trackIds.map(function (trackId) {
                return playerTracks[trackId] || [];
            });
        }
        var Song = (function () {
            function Song(data) {
                var o = this;
                o.midi = Game.Parsers.Midi.parseMidi(data);
                o.midi.tracks = sortPlayerTracksByHands(o.midi.tracks);
                normalizeVolumeOfPlayerTracks(o.midi.tracks);
                o.midi.sustainNotes = filterSustainNotes(o.midi.sustainNotes);
                o.sceneSustainNotes = computeSceneSustainNotes(o.midi.sustainNotes);
                o.sceneTracks = computeSceneTracks(o.midi.tracks);
                o.playedNoteID = getMinMaxNoteId(o.sceneTracks);
                o.midi.tracks = computeCleanedPlayerTracks(o.sceneTracks);
                o.timePerSong = computeTimePerSong(o.midi.tracks);
            }
            return Song;
        })();
        Game.Song = Song;
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var List;
    (function (List) {
        var Keyboard;
        (function (Keyboard) {
            function enter() {
                Mousetrap.bind('enter', function (e) {
                    var href = $('.song-list-el-focus a').attr('href');
                    Musicope.mainView.router.loadPage(href);
                    e.preventDefault();
                });
            }
            function up() {
                Mousetrap.bind('up', function (e) {
                    var oldEl = $('.song-list-el-focus');
                    var newEl = oldEl.prevAll(':visible').first();
                    if (newEl.length > 0) {
                        oldEl.removeClass('song-list-el-focus');
                        newEl.addClass('song-list-el-focus');
                        Musicope.correctPosition();
                    }
                    e.preventDefault();
                });
            }
            function down() {
                Mousetrap.bind('down', function (e) {
                    var oldEl = $('.song-list-el-focus');
                    var newEl = oldEl.nextAll(':visible').first();
                    if (newEl.length > 0) {
                        oldEl.removeClass('song-list-el-focus');
                        newEl.addClass('song-list-el-focus');
                        Musicope.correctPosition();
                    }
                    e.preventDefault();
                });
            }
            function home() {
                Mousetrap.bind('home', function (e) {
                    var list = $('.song-list');
                    var newEl = list.find('li:visible').first();
                    if (newEl.length > 0) {
                        list.find('.song-list-el-focus').removeClass('song-list-el-focus');
                        newEl.addClass('song-list-el-focus');
                        Musicope.correctPosition();
                    }
                    e.preventDefault();
                });
            }
            function end() {
                Mousetrap.bind('end', function (e) {
                    var list = $('.song-list');
                    var newEl = list.find('li:visible').last();
                    if (newEl.length > 0) {
                        list.find('.song-list-el-focus').removeClass('song-list-el-focus');
                        newEl.addClass('song-list-el-focus');
                        Musicope.correctPosition();
                    }
                    e.preventDefault();
                });
            }
            function pageDown() {
                Mousetrap.bind('pagedown', function (e) {
                    var oldEl = $('.song-list-el-focus');
                    var newEls = oldEl.nextAll(':visible');
                    var newEl = newEls.length == 0 ? oldEl : (newEls.length < 5 ? newEls.last() : $(newEls[4]));
                    oldEl.removeClass('song-list-el-focus');
                    newEl.addClass('song-list-el-focus');
                    Musicope.correctPosition();
                    e.preventDefault();
                });
            }
            function pageUp() {
                Mousetrap.bind('pageup', function (e) {
                    var oldEl = $('.song-list-el-focus');
                    var newEls = oldEl.prevAll(':visible');
                    var newEl = newEls.length == 0 ? oldEl : (newEls.length < 5 ? newEls.last() : $(newEls[4]));
                    oldEl.removeClass('song-list-el-focus');
                    newEl.addClass('song-list-el-focus');
                    Musicope.correctPosition();
                    e.preventDefault();
                });
            }
            function bindKeyboard() {
                down();
                up();
                home();
                end();
                pageDown();
                pageUp();
                enter();
            }
            Keyboard.bindKeyboard = bindKeyboard;
        })(Keyboard = List.Keyboard || (List.Keyboard = {}));
    })(List = Musicope.List || (Musicope.List = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var List;
    (function (List) {
        var scores = {};
        var scoresDirty = false;
        function sortList() {
            var els = $('.song-list li:visible');
            els.sort(function (a, b) {
                var countA = parseInt($(a).find('.vote-count').text());
                var countB = parseInt($(b).find('.vote-count').text());
                if (countB === countA) {
                    var nameA = $(a).find('.item-title').text();
                    var nameB = $(b).find('.item-title').text();
                    return nameA > nameB ? 1 : -1;
                }
                else {
                    return countB - countA;
                }
            });
            els.detach().appendTo('.song-list');
        }
        function voteUp(e) {
            var id = decodeURIComponent($(this).parents('li').children('.elURL').text().trim());
            var old = parseInt(scores[id] || '0');
            scores[id] = old + 1;
            scoresDirty = true;
            $(this).siblings('.vote-count').text(old + 1);
            e.stopPropagation();
            e.preventDefault();
        }
        function voteDown(e) {
            var id = decodeURIComponent($(this).parents('li').children('.elURL').text().trim());
            var old = parseInt(scores[id] || '0');
            scores[id] = old - 1;
            scoresDirty = true;
            $(this).siblings('.vote-count').text(old - 1);
            e.stopPropagation();
            e.preventDefault();
        }
        function populateDOM(files, scores) {
            files.forEach(function (file) {
                var score = scores[file] || "0";
                var m = file.match(/^songs\\(.*?)([^\\]+)$/);
                var path = m[1];
                var title = m[2].replace(/_/g, " ");
                var template = $('.song-list-template').html().trim().replace("{{title}}", title).replace("{{titleEnc}}", encodeURIComponent(title)).replace("{{path}}", path).replace("{{score}}", score).replace(/{{urlEnc}}/g, encodeURIComponent(file)).replace(/{{url}}/g, file);
                $(template).appendTo('.song-list');
            });
            sortList();
        }
        function startSavingScores() {
            setInterval(function () {
                if (scoresDirty) {
                    var text = JSON.stringify(scores, null, 4);
                    scoresDirty = false;
                    io.writeFile(Musicope.songsJsonPath, text);
                }
            }, 1000);
        }
        function initScores() {
            var fileExists = io.existsFile(Musicope.songsJsonPath);
            if (fileExists) {
                var text = io.readFile(Musicope.songsJsonPath);
                eval("scores = " + text);
            }
            startSavingScores();
        }
        function init() {
            initScores();
            var files = JSON.parse(io.getAllFiles("songs"));
            populateDOM(files, scores);
            $('.song-list li:visible:first').addClass('song-list-el-focus');
            $('.vote-up').on('click', voteUp);
            $('.vote-down').on('click', voteDown);
            List.Keyboard.bindKeyboard();
        }
        List.init = init;
    })(List = Musicope.List || (Musicope.List = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    Musicope.defaultConfig = {
        // controllers
        c_songUrl: undefined,
        p_elapsedTime: undefined,
        p_initTime: undefined,
        // players
        p_deviceIn: "0",
        p_deviceOut: "0",
        p_isPaused: false,
        p_minNote: 36,
        p_maxNote: 96,
        p_playOutOfReachNotes: true,
        p_waitForOutOfReachNotes: true,
        p_radiuses: [200, 200],
        p_speed: 1,
        p_sustain: true,
        p_userHands: [false, false],
        p_volumes: [0.75, 1],
        p_waits: [true, true],
        p_maxVelocity: [90, 90],
        // metronomes
        m_channel: 153,
        m_id1: 60,
        m_id2: 56,
        m_isOn: true,
        m_ticksPerBeat: 1,
        m_velocity: 12,
        // parsers
        f_normalize: 60,
        f_trackIds: [1, 0],
        // scenes
        s_showPiano: true,
        s_showSustainBg: false,
        s_views: ["full", "full"],
        s_quartersPerHeight: 10,
        s_showBlackRails: true,
        s_noteCoverRelHeight: 0.0,
        s_colorBlackRails2: "#371313",
        s_colorBlackRails3: "#282200",
        s_colWhites: ["#ff5252", "#ffd800"],
        s_colBlacks: ["#b73f3f", "#a78d00"],
        s_colTime: "#0094ff",
        s_colPianoWhite: "#2c79b2",
        s_colPianoBlack: "#3faeff",
        s_colSustain: "#00ff90",
        s_colSustainBg: "#002f1a",
        s_colPaused: "#090714",
        s_colUnPaused: "#0d0c0c",
        s_colUnPlayedNotes: "#808080",
        s_colOutOfReachNotes: "#ff5252",
        s_colUnPlayedNotesInReach: "#00ff90"
    };
    Musicope.config;
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    Musicope.game;
    Musicope.app;
    Musicope.mainView;
    Musicope.webMidi;
    Musicope.songsJsonPath = "songs.json";
    Musicope.setupJsonPath = "setup.json";
    function correctPosition() {
        var ul = $('.list-scroll');
        var li = $(".song-list-el-focus");
        var rely = li.position().top - ul.scrollTop() + 35;
        var drely1 = rely + 1.5 * li.height() - ul.height();
        var drely2 = rely - 0.5 * li.height();
        if (drely1 > 0) {
            ul.scrollTop(ul.scrollTop() + drely1);
        }
        else if (drely2 < 0) {
            ul.scrollTop(ul.scrollTop() + drely2);
        }
        return true;
    }
    Musicope.correctPosition = correctPosition;
    $(document).ready(function () {
        Musicope.app = new Framework7({
            swipeBackPage: false
        });
        Musicope.mainView = Musicope.app.addView('.view-main', {
            domCache: true
        });
        var mySearchbar = Musicope.app.searchbar('.searchbar', {
            searchList: '.list-block-search',
            searchIn: '.item-title, .item-text'
        });
        $('.list-block-search').on('search', function (a, b, c) {
            $('.song-list-el-focus').removeClass('song-list-el-focus');
            $('.list-scroll li:visible:first').addClass('song-list-el-focus');
            $('.list-scroll').scrollTop(0);
        });
        Musicope.app.onPageBeforeAnimation('play', function (page) {
            if ('url' in page.query) {
                $('.searchbar-input input').blur();
                Mousetrap.reset();
                Musicope.config = jQuery.extend(true, {}, Musicope.defaultConfig);
                Musicope.config.c_songUrl = decodeURIComponent(page.query.url);
                Musicope.game = new Musicope.Game.Game();
                var path = decodeURIComponent(page.query.url).replace(/songs\\(.+)\\[^\\]+$/, '$1');
                $('.playTitle').text(decodeURIComponent(page.query.title));
                $('.playPath').text(path);
                Musicope.app.sizeNavbars();
            }
        });
        Musicope.app.onPageAfterAnimation('index', function (page) {
            $('.searchbar-input input').focus();
            Mousetrap.reset();
            Musicope.Params.reset();
            Musicope.List.Keyboard.bindKeyboard();
            correctPosition();
        });
        Musicope.app.onPageAfterAnimation('help', function (page) {
            Musicope.config.p_isPaused = true;
        });
        Musicope.List.init();
        Musicope.Setup.init();
        Musicope.webMidi = new Musicope.WebMidi();
    });
})(Musicope || (Musicope = {}));
//# sourceMappingURL=app.js.map
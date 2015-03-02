var Musicope;
(function (Musicope) {
    Musicope.dropbox = new Dropbox.Client({ key: "ckt9l58i8fpcq6d" });
    Musicope.game;
    $(document).ready(function () {
        Musicope.List.init();
    });
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (_Game) {
        var Game = (function () {
            function Game() {
                var _this = this;
                this.dispose = function () {
                    var o = _this;
                    o.driver.dispose();
                    o.metronome.dispose();
                    o.player.dispose();
                    o.scene.dispose();
                    o.keyboard.dispose();
                };
                this.requestAnimationFrame = window["requestAnimationFrame"] || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] || window["msRequestAnimationFrame"] || function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
                var o = this;
                $('#listView').hide();
                $('#gameView').show();
                if (!Musicope.params.c_songUrl) {
                    throw "c_songUrl does not exist!";
                }
                else {
                    o.driver = new _Game.Drivers[Musicope.params.c_driver]();
                    o.driver.ready.done(function () {
                        o.getSong().done(function (arr) {
                            o.init(arr);
                        });
                    });
                }
            }
            Game.prototype.getSong = function () {
                var o = this;
                var out = $.Deferred();
                Musicope.dropbox.readFile(Musicope.params.c_songUrl, { arrayBuffer: true }, function (error, data) {
                    var arr = new Uint8Array(data);
                    if (error || arr.length == 0) {
                        throw "error loading midi file";
                    }
                    out.resolve(arr);
                });
                return out.promise();
            };
            Game.prototype.init = function (arr) {
                var o = this;
                o.song = new _Game.Song(arr);
                o.scene = new _Game.Scene(o.song);
                o.metronome = new _Game.Metronome(o.song.midi.timePerBeat, o.song.midi.timePerBar / o.song.midi.timePerBeat, o.driver);
                o.player = new _Game.Player(o.driver, o.song, o.metronome, o.scene);
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
    var Game;
    (function (Game) {
        var Drivers;
        (function (Drivers) {
            var WebMidi = (function () {
                function WebMidi() {
                    var _this = this;
                    this.ready = $.Deferred();
                    this.inList = function () {
                        return _this.midi.inputs;
                    };
                    this.outList = function () {
                        return _this.midi.outputs;
                    };
                    this.inOpen = function (callback) {
                        var o = _this;
                        o.input = o.midi.inputs.get(Musicope.params.p_deviceIn);
                        if (o.input) {
                            o.input.onmidimessage = function (e) {
                                callback(e.timeStamp, e.data[0], e.data[1], e.data[2]);
                            };
                        }
                    };
                    this.outOpen = function () {
                        var o = _this;
                        o.output = o.midi.outputs.get(Musicope.params.p_deviceOut);
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
                    this.outClose = function () {
                    };
                    this.out = function (byte1, byte2, byte3) {
                        var data = [byte1, byte2];
                        if (typeof byte3 === "number") {
                            data.push(byte3);
                        }
                        _this.output.send(data);
                    };
                    this.dispose = function () {
                        var o = _this;
                        o.inClose();
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
            Drivers.WebMidi = WebMidi;
        })(Drivers = Game.Drivers || (Game.Drivers = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var Keyboard = (function () {
            function Keyboard(song) {
                var _this = this;
                this.song = song;
                this.actions = [];
                this.dispose = function () {
                    var o = _this;
                    o.unsubscribeActions();
                };
                var o = this;
                o.initActions();
                o.checkActionsDuplicates();
                o.subscribeActions();
            }
            Keyboard.prototype.initActions = function () {
                var o = this;
                var deff = $.Deferred();
                var keyboardParams = {
                    song: o.song,
                    actions: deff.promise()
                };
                for (var prop in Game.KeyboardFns.Actions.List) {
                    var action = new Game.KeyboardFns.Actions.List[prop](keyboardParams);
                    o.actions.push(action);
                }
                deff.resolve(o.actions);
            };
            Keyboard.prototype.checkActionsDuplicates = function () {
                var o = this;
                var keys = {};
                o.actions.forEach(function (action) {
                    if (keys[action.key]) {
                        var text = "duplicate keys: '" + keys[action.key] + "' vs '" + action.id + "'";
                        throw text;
                    }
                    keys[action.key] = action.id;
                });
            };
            Keyboard.prototype.subscribeActions = function () {
                var o = this;
                o.actions.forEach(function (action) {
                    Mousetrap.bind(action.key, function () {
                        action.triggerAction();
                        Game.KeyboardFns.Overlay.display(action.id, action.getCurrentState());
                    });
                });
            };
            Keyboard.prototype.unsubscribeActions = function () {
                var o = this;
                o.actions.forEach(function (action) {
                    Mousetrap.unbind(action.key);
                });
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
        var KeyboardFns;
        (function (KeyboardFns) {
            var Overlay;
            (function (Overlay) {
                var displayDescription;
                var displayValue;
                var oldTimeOut;
                function createDomIfNeeded() {
                    if (!displayDescription || !displayValue) {
                        var container = $("<div style='position:absolute; top:0px; left:0; color:white; font-size:xx-large; text-align:left;' />").appendTo("body");
                        displayDescription = $("<span />").appendTo(container);
                        displayValue = $("<span style='color:red;' />").appendTo(container);
                    }
                }
                function display(description, value) {
                    if (value) {
                        var str;
                        if (typeof value == "number") {
                            str = Math.round(1000 * value) / 1000;
                        }
                        else {
                            str = value;
                        }
                        createDomIfNeeded();
                        displayDescription.text(description + ": ");
                        displayValue.text(str);
                        clearTimeout(oldTimeOut);
                        oldTimeOut = setTimeout(function () {
                            displayDescription.text("");
                            displayValue.text("");
                        }, 5000);
                    }
                }
                Overlay.display = display;
            })(Overlay = KeyboardFns.Overlay || (KeyboardFns.Overlay = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var Tools;
                (function (Tools) {
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
                    Tools.areEqual = areEqual;
                    function toggle(currentOption, options) {
                        for (var i = 0; i < options.length; i++) {
                            if (areEqual(currentOption, options[i])) {
                                return options[(i + 1) % options.length];
                            }
                        }
                    }
                    Tools.toggle = toggle;
                })(Tools = Actions.Tools || (Actions.Tools = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var CoverNotes = (function () {
                        function CoverNotes(p) {
                            this.p = p;
                            this.id = "cover notes";
                            this.description = "Cover notes";
                            this.key = "c";
                            this.states = [0.0, 0.2, 0.4, 0.6, 0.8];
                        }
                        CoverNotes.prototype.triggerAction = function () {
                            var o = this;
                            var height = Actions.Tools.toggle(Musicope.params.s_noteCoverRelHeight, o.states);
                            Musicope.Params.setParam("s_noteCoverRelHeight", height);
                        };
                        CoverNotes.prototype.getCurrentState = function () {
                            var o = this;
                            return Musicope.params.s_noteCoverRelHeight;
                        };
                        return CoverNotes;
                    })();
                    List.CoverNotes = CoverNotes;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var isFirst = true;
                    var displayHelp = (function () {
                        function displayHelp(p) {
                            this.p = p;
                            this.id = "display help";
                            this.description = "displays a help window";
                            this.key = "enter";
                            this.isDisplayed = false;
                            var o = this;
                            o.window = $("#displayHelpOverlay");
                        }
                        displayHelp.prototype.triggerAction = function () {
                            var o = this;
                            o.isDisplayed = !o.isDisplayed;
                            Musicope.Params.setParam("p_isPaused", o.isDisplayed);
                            o.display();
                        };
                        displayHelp.prototype.getCurrentState = function () {
                            var o = this;
                            return o.isDisplayed;
                        };
                        displayHelp.prototype.display = function () {
                            var o = this;
                            if (o.isDisplayed) {
                                o.p.actions.done(function (actions) {
                                    Musicope.Params.subscribe("displayHelp", ".*", function (name, value) {
                                        o.refillTable(actions);
                                    });
                                    o.refillTable(actions);
                                    o.window.css("display", "block");
                                });
                            }
                            else {
                                Musicope.Params.unsubscribe("displayHelp");
                                o.window.css("display", "none");
                            }
                        };
                        displayHelp.prototype.refillTable = function (actions) {
                            var o = this;
                            var table = o.window.children("table");
                            table.find("tr:has(td)").html("");
                            var sortedActions = actions.sort(function (a, b) {
                                return (a.id > b.id);
                            });
                            sortedActions.forEach(function (action) {
                                var row = $("<tr/>").appendTo(table);
                                var idCell = $("<td class='idCell'/>").appendTo(row);
                                var keyCell = $("<td class='keyCell'/>").appendTo(row);
                                var descriptionCell = $("<td class='descriptionCell'/>").appendTo(row);
                                var currentCell = $("<td class='currentCell'/>").appendTo(row);
                                idCell.text(action.id);
                                keyCell.text("" + action.key);
                                descriptionCell.text(action.description);
                                currentCell.text(o.tryRoundValue(action.getCurrentState()));
                            });
                        };
                        displayHelp.prototype.tryRoundValue = function (value) {
                            if (typeof value == "number") {
                                return Math.round(100 * value) / 100;
                            }
                            else {
                                return value;
                            }
                        };
                        return displayHelp;
                    })();
                    List.displayHelp = displayHelp;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var Exit = (function () {
                        function Exit(p) {
                            this.p = p;
                            this.id = "exit";
                            this.description = "Exits the game view.";
                            this.key = "esc";
                        }
                        Exit.prototype.triggerAction = function () {
                            Musicope.game.dispose();
                            Musicope.Params.reset();
                            Musicope.List.Keyboard.bindKeyboard();
                            $('#gameView').hide();
                            $('#listView').show();
                            $('#query').focus();
                            var top = $('.elFocus').offset().top - 0.5 * $(window).height();
                            $(window).scrollTop(top);
                        };
                        Exit.prototype.getCurrentState = function () {
                        };
                        return Exit;
                    })();
                    List.Exit = Exit;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var MetronomeOn = (function () {
                        function MetronomeOn(p) {
                            this.p = p;
                            this.id = "metronome";
                            this.description = "toggle state of the metronome on/off";
                            this.key = "m";
                        }
                        MetronomeOn.prototype.triggerAction = function () {
                            var o = this;
                            Musicope.Params.setParam("m_isOn", !Musicope.params.m_isOn);
                        };
                        MetronomeOn.prototype.getCurrentState = function () {
                            var o = this;
                            return Musicope.params.m_isOn ? "on" : "off";
                        };
                        return MetronomeOn;
                    })();
                    List.MetronomeOn = MetronomeOn;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var MoveBack = (function () {
                        function MoveBack(p) {
                            this.p = p;
                            this.id = "move back";
                            this.description = "move back by the amount of 2 beats";
                            this.key = "left";
                        }
                        MoveBack.prototype.triggerAction = function () {
                            var o = this;
                            var newTime = Musicope.params.p_elapsedTime - 2 * o.p.song.midi.timePerBeat;
                            var truncTime = Math.max(Musicope.params.p_initTime, newTime);
                            Musicope.Params.setParam("p_elapsedTime", truncTime);
                        };
                        MoveBack.prototype.getCurrentState = function () {
                            var o = this;
                            return Musicope.params.p_elapsedTime / 1000;
                        };
                        return MoveBack;
                    })();
                    List.MoveBack = MoveBack;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var MoveForward = (function () {
                        function MoveForward(p) {
                            this.p = p;
                            this.id = "move forward";
                            this.description = "move forward by the amount of 2 beats";
                            this.key = "right";
                        }
                        MoveForward.prototype.triggerAction = function () {
                            var o = this;
                            var newTime = Musicope.params.p_elapsedTime + 2 * o.p.song.midi.timePerBeat;
                            var truncTime = Math.min(o.p.song.timePerSong + 10, newTime);
                            Musicope.Params.setParam("p_elapsedTime", truncTime);
                        };
                        MoveForward.prototype.getCurrentState = function () {
                            var o = this;
                            return Musicope.params.p_elapsedTime / 1000;
                        };
                        return MoveForward;
                    })();
                    List.MoveForward = MoveForward;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var MoveHome = (function () {
                        function MoveHome(p) {
                            this.p = p;
                            this.id = "move home";
                            this.description = "move to the initial state of the song";
                            this.key = "home";
                        }
                        MoveHome.prototype.triggerAction = function () {
                            var o = this;
                            Musicope.Params.setParam("p_elapsedTime", Musicope.params.p_initTime);
                        };
                        MoveHome.prototype.getCurrentState = function () {
                            var o = this;
                            return Musicope.params.p_elapsedTime / 1000;
                        };
                        return MoveHome;
                    })();
                    List.MoveHome = MoveHome;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var PauseOn = (function () {
                        function PauseOn(p) {
                            this.p = p;
                            this.id = "pause";
                            this.description = "pause and unpause the game";
                            this.key = "space";
                        }
                        PauseOn.prototype.triggerAction = function () {
                            var o = this;
                            Musicope.Params.setParam("p_isPaused", !Musicope.params.p_isPaused);
                        };
                        PauseOn.prototype.getCurrentState = function () {
                            var o = this;
                            return Musicope.params.p_isPaused ? "on" : "off";
                        };
                        return PauseOn;
                    })();
                    List.PauseOn = PauseOn;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var SlowDown = (function () {
                        function SlowDown(p) {
                            this.p = p;
                            this.id = "slow down";
                            this.description = "slow down the song by 10%";
                            this.key = "down";
                        }
                        SlowDown.prototype.triggerAction = function () {
                            var o = this;
                            Musicope.Params.setParam("p_speed", Musicope.params.p_speed - 0.1);
                        };
                        SlowDown.prototype.getCurrentState = function () {
                            var o = this;
                            return Musicope.params.p_speed * 100;
                        };
                        return SlowDown;
                    })();
                    List.SlowDown = SlowDown;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var SpeedUp = (function () {
                        function SpeedUp(p) {
                            this.p = p;
                            this.id = "speed up";
                            this.description = "speed up the song by 10%";
                            this.key = "up";
                        }
                        SpeedUp.prototype.triggerAction = function () {
                            var o = this;
                            Musicope.Params.setParam("p_speed", Musicope.params.p_speed + 0.1);
                        };
                        SpeedUp.prototype.getCurrentState = function () {
                            var o = this;
                            return Musicope.params.p_speed * 100;
                        };
                        return SpeedUp;
                    })();
                    List.SpeedUp = SpeedUp;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var UserHands = (function () {
                        function UserHands(p) {
                            this.p = p;
                            this.id = "user hands";
                            this.description = "toggle which hands the user plays.";
                            this.key = "h";
                            this.options = [[false, false], [false, true], [true, false], [true, true]];
                            this.names = ["none", "right", "left", "both"];
                        }
                        UserHands.prototype.triggerAction = function () {
                            var o = this;
                            Musicope.Params.setParam("p_userHands", Actions.Tools.toggle(Musicope.params.p_userHands, o.options));
                        };
                        UserHands.prototype.getCurrentState = function () {
                            var o = this;
                            var i = o.options.indexOf(Musicope.params.p_userHands);
                            return o.names[i];
                        };
                        return UserHands;
                    })();
                    List.UserHands = UserHands;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var KeyboardFns;
        (function (KeyboardFns) {
            var Actions;
            (function (Actions) {
                var List;
                (function (List) {
                    var WaitOn = (function () {
                        function WaitOn(p) {
                            this.p = p;
                            this.id = "wait";
                            this.description = "shall the song wait for the user?";
                            this.key = "w";
                            this.options = [[false, false], [true, true]];
                            this.names = ["off", "on"];
                        }
                        WaitOn.prototype.triggerAction = function () {
                            var o = this;
                            Musicope.Params.setParam("p_waits", Actions.Tools.toggle(Musicope.params.p_waits, o.options));
                        };
                        WaitOn.prototype.getCurrentState = function () {
                            var o = this;
                            var i = o.options.indexOf(Musicope.params.p_waits);
                            return o.names[i];
                        };
                        return WaitOn;
                    })();
                    List.WaitOn = WaitOn;
                })(List = Actions.List || (Actions.List = {}));
            })(Actions = KeyboardFns.Actions || (KeyboardFns.Actions = {}));
        })(KeyboardFns = Game.KeyboardFns || (Game.KeyboardFns = {}));
    })(Game = Musicope.Game || (Musicope.Game = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Game;
    (function (Game) {
        var Metronome = (function () {
            function Metronome(timePerBeat, beatsPerBar, device) {
                var _this = this;
                this.timePerBeat = timePerBeat;
                this.beatsPerBar = beatsPerBar;
                this.device = device;
                this.lastPlayedId = -10000;
                this.play = function (time) {
                    var o = _this;
                    if (Musicope.params.m_isOn) {
                        var id = Math.floor(Musicope.params.m_ticksPerBeat * time / o.timePerBeat);
                        if (id > o.lastPlayedId) {
                            var noteId = id % o.beatsPerBar == 0 ? Musicope.params.m_id1 : Musicope.params.m_id2;
                            var velocity = Math.min(127, Musicope.params.m_velocity);
                            o.device.out(Musicope.params.m_channel, noteId, velocity);
                            o.lastPlayedId = id;
                        }
                    }
                };
                this.reset = function () {
                    var o = _this;
                    o.lastPlayedId = -10000;
                };
                this.dispose = function () {
                    Musicope.Params.unsubscribe("metronome");
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
                    var str = String.fromCharCode.apply(null, midi);
                    var midiFile = MidiFile(str);
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
        function driverOnNotesToOff(driver) {
            for (var i = 0; i < 128; i++) {
                driver.out(144, i, 0);
            }
        }
        function getIdBelowCurrentTime(notes) {
            if (notes.length > 0) {
                var id = notes.length - 1;
                while (id >= 0 && notes[id] && notes[id].time > Musicope.params.p_elapsedTime) {
                    id--;
                }
                return id;
            }
        }
        function getIdsBelowCurrentTime(playerTracks) {
            return playerTracks.map(getIdBelowCurrentTime);
        }
        function correctTimesInParams(timePerBar) {
            if (typeof Musicope.params.p_initTime == 'undefined') {
                Musicope.Params.setParam("p_initTime", -2 * timePerBar);
            }
            if (typeof Musicope.params.p_elapsedTime == 'undefined') {
                Musicope.Params.setParam("p_elapsedTime", Musicope.params.p_initTime);
            }
        }
        var Player = (function () {
            function Player(driver, song, metronome, scene) {
                var _this = this;
                this.driver = driver;
                this.song = song;
                this.metronome = metronome;
                this.scene = scene;
                this.step = function () {
                    var o = _this;
                    o.playNotes.play();
                    o.playSustains.play();
                    o.metronome.play(Musicope.params.p_elapsedTime);
                    o.scene.redraw(Musicope.params.p_elapsedTime, Musicope.params.p_isPaused);
                    var isFreeze = o.waitForNote.isFreeze();
                    hideTimeBarIfStops(o.scene, isFreeze);
                    return o.updateTime(isFreeze);
                };
                this.dispose = function () {
                    var o = _this;
                    o.fromDevice.dispose();
                    Musicope.Params.unsubscribe("players.Basic");
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
                    driverOnNotesToOff(o.driver);
                };
                this.assignClasses = function () {
                    var o = _this;
                    o.fromDevice = new Game.PlayerFns.FromDevice(o.driver, o.scene, o.song.midi.tracks);
                    o.playNotes = new Game.PlayerFns.PlayNotes(o.driver, o.scene, o.song.midi.tracks);
                    o.playSustains = new Game.PlayerFns.PlaySustains(o.driver, o.song.midi.sustainNotes);
                    o.waitForNote = new Game.PlayerFns.WaitForNote(o.driver, o.song.midi.tracks, o.fromDevice.onNoteOn);
                };
                this.updateTime = function (isFreeze) {
                    var o = _this;
                    var currentTime = Date.now();
                    if (!o.previousTime) {
                        o.previousTime = currentTime;
                    }
                    var duration = currentTime - o.previousTime;
                    o.previousTime = currentTime;
                    var isSongEnd = Musicope.params.p_elapsedTime > o.song.timePerSong + 1000;
                    var doFreezeTime = isSongEnd || Musicope.params.p_isPaused || isFreeze || duration > 100; /*window was out of focus*/
                    if (!doFreezeTime) {
                        var newElapsedTime = Musicope.params.p_elapsedTime + Musicope.params.p_speed * duration;
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
            function sendBackToDevice(driver, kind, noteId, velocity) {
                if (kind < 242 && (kind < 127 || kind > 160)) {
                    driver.out(kind, noteId, velocity);
                }
            }
            function execNoteOnFuncs(noteOnFuncs, noteId) {
                for (var i = 0; i < noteOnFuncs.length; i++) {
                    noteOnFuncs[i](noteId);
                }
            }
            var FromDevice = (function () {
                function FromDevice(driver, scene, notes) {
                    var _this = this;
                    this.driver = driver;
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
                    this.dispose = function () {
                        var o = _this;
                        o.driver.inClose();
                        o.driver.outClose();
                    };
                    this.deviceIn = function (timeStamp, kind, noteId, velocity) {
                        var o = _this;
                        sendBackToDevice(o.driver, kind, noteId, velocity);
                        var isNoteOn = kind === 144 && velocity > 0;
                        var isNoteOff = kind === 128 || (kind === 144 && velocity == 0);
                        if (isNoteOn && !o.isDoubleNote(timeStamp, isNoteOn, noteId, velocity)) {
                            console.log(timeStamp + " " + kind + " " + noteId + " " + velocity);
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
                    o.driver.outOpen();
                    o.driver.out(0x80, 0, 0);
                    o.driver.inOpen(o.deviceIn);
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
                function PlayNotes(driver, scene, notes) {
                    var _this = this;
                    this.driver = driver;
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
                        return o.notes[trackId][o.ids[trackId]] && o.notes[trackId][o.ids[trackId]].time < Musicope.params.p_elapsedTime;
                    };
                    this.playNote = function (note, trackId) {
                        var o = _this;
                        var playsUser = Musicope.params.p_userHands[trackId];
                        if (!playsUser || o.playOutOfReach(note)) {
                            if (note.on) {
                                o.driver.out(144, note.id, Math.min(127, o.getVelocity(trackId, note)));
                                o.scene.setActiveId(note.id);
                            }
                            else {
                                o.driver.out(144, note.id, 0);
                                o.scene.unsetActiveId(note.id);
                            }
                        }
                    };
                    this.playOutOfReach = function (note) {
                        var o = _this;
                        var isBelowMin = note.id < Musicope.params.p_minNote;
                        var isAboveMax = note.id > Musicope.params.p_maxNote;
                        Musicope.params.p_playOutOfReachNotes && (isBelowMin || isAboveMax);
                    };
                    this.getVelocity = function (trackId, note) {
                        var o = _this;
                        var velocity = Musicope.params.p_volumes[trackId] * note.velocity;
                        var maxVelocity = Musicope.params.p_maxVelocity[trackId];
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
                return sustainNotes[id] && sustainNotes[id].time < Musicope.params.p_elapsedTime;
            }
            function playSustainNote(driver, note) {
                if (Musicope.params.p_sustain) {
                    if (note.on) {
                        driver.out(176, 64, 127);
                    }
                    else {
                        driver.out(176, 64, 0);
                    }
                }
            }
            var PlaySustains = (function () {
                function PlaySustains(driver, sustainNotes) {
                    var _this = this;
                    this.driver = driver;
                    this.sustainNotes = sustainNotes;
                    this.id = 0;
                    this.play = function () {
                        var o = _this;
                        while (isIdBelowCurrentTime(o.sustainNotes, o.id)) {
                            playSustainNote(o.driver, o.sustainNotes[o.id]);
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
                function WaitForNote(device, notes, onNoteOn) {
                    var _this = this;
                    this.device = device;
                    this.notes = notes;
                    this.onNoteOn = onNoteOn;
                    this.isFreeze = function () {
                        var o = _this;
                        var freeze = false;
                        for (var trackId = 0; trackId < o.notes.length; trackId++) {
                            var isWait = Musicope.params.p_userHands[trackId] && Musicope.params.p_waits[trackId];
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
                        for (var i = 0; i < Musicope.params.p_userHands.length; i++) {
                            if (Musicope.params.p_userHands[i]) {
                                var id = o.ids[i];
                                while (o.isIdBelowCurrentTimePlusRadius(i, id)) {
                                    var note = o.notes[i][id];
                                    if (note.on && !o.notesPressedTime[i][id] && note.id === noteId) {
                                        var radius = Math.abs(o.notes[i][id].time - Musicope.params.p_elapsedTime) - 50;
                                        if (radius < Musicope.params.p_radiuses[i]) {
                                            o.notesPressedTime[i][id] = Musicope.params.p_elapsedTime;
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
                        return o.notes[trackId][noteId] && o.notes[trackId][noteId].time < Musicope.params.p_elapsedTime + Musicope.params.p_radiuses[trackId];
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
                        return o.notes[trackId][noteId] && o.notes[trackId][noteId].time < Musicope.params.p_elapsedTime - Musicope.params.p_radiuses[trackId];
                    };
                    this.isNoteUnpressed = function (trackId, noteId) {
                        var o = _this;
                        var note = o.notes[trackId][noteId];
                        var wasPlayedByUser = o.notesPressedTime[trackId][noteId];
                        var waitForOutOfReach = true;
                        if (!Musicope.params.p_waitForOutOfReachNotes) {
                            var isNoteAboveMin = note.id >= Musicope.params.p_minNote;
                            var isNoteBelowMax = note.id <= Musicope.params.p_maxNote;
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
                this.dispose = function () {
                    Musicope.Params.unsubscribe("scene.Basic");
                };
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
                o.pausedColor = new Int32Array(Game.SceneFns.hexToRgb(Musicope.params.s_colPaused));
                o.unpausedColor = new Int32Array(Game.SceneFns.hexToRgb(Musicope.params.s_colUnPaused));
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
                o.pixelsPerTime = o.canvas.height * 4 / (o.song.midi.noteValuePerBeat * Musicope.params.s_quartersPerHeight * o.song.midi.timePerBeat);
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
                    p_minNote: Musicope.params.p_minNote,
                    p_maxNote: Musicope.params.p_maxNote,
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
            function drawNoteCover(loc) {
                if (Musicope.params.s_noteCoverRelHeight > 0.0) {
                    var y0 = loc.yEndOfTimeBar;
                    var y1 = y0 + Musicope.params.s_noteCoverRelHeight * (loc.input.sceneHeight - loc.yEndOfTimeBar);
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
                    var activeColor = hexToRgb(Musicope.params.s_colPianoBlack);
                    loc.input.drawRect(x0, y0, x1, y1, [id], [0, 0, 0, 1], activeColor);
                });
            }
            function getColorForWhitePianoNotes(id, loc) {
                var unPressedColor = [1, 1, 1, 1];
                var neverPlayedNote = id < loc.input.playedNoteID.min || id > loc.input.playedNoteID.max;
                var outOfReachNote = id < loc.input.p_minNote || id > loc.input.p_maxNote;
                var color;
                if (neverPlayedNote && !outOfReachNote) {
                    var notPlayedColor = hexToRgb(Musicope.params.s_colUnPlayedNotesInReach);
                    color = notPlayedColor;
                }
                else if (neverPlayedNote) {
                    var notPlayedColor = hexToRgb(Musicope.params.s_colUnPlayedNotes);
                    color = notPlayedColor;
                }
                else if (outOfReachNote) {
                    var outOfReachColor = hexToRgb(Musicope.params.s_colOutOfReachNotes);
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
                    var activeColor = hexToRgb(Musicope.params.s_colPianoWhite);
                    loc.input.drawRect(x0, y0, x1, y1, [id], color, activeColor);
                });
            }
            function drawPianoTimeBarColor(loc) {
                var color = hexToRgb(Musicope.params.s_colTime, 0.9);
                var activeColor = hexToRgb(Musicope.params.s_colTime, 0.4);
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
                if (Musicope.params.s_showPiano) {
                    drawPianoBackBlack(loc);
                    drawPianoWhiteNotes(loc);
                    drawPianoBlackNotes(loc);
                }
            }
            function drawSustainNotes(loc) {
                var color = hexToRgb(Musicope.params.s_colSustain);
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
                var whiteNoteColor = hexToRgb(Musicope.params.s_colWhites[trackId]);
                var blackNoteColor = hexToRgb(Musicope.params.s_colBlacks[trackId]);
                var minMaxVel = getMinMaxVelocity(loc.input.tracks[trackId]);
                loc.input.tracks[trackId].forEach(function (note) {
                    var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 1;
                    var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
                    var ipos = whiteNoteIds.indexOf(note.id);
                    if (ipos >= 0) {
                        var x0 = ipos * loc.whiteWidth + 3;
                        var x1 = x0 + loc.whiteWidth - 5;
                        var color = getColorByVelocity(whiteNoteColor, note.velocityOn, minMaxVel);
                        loc.input.drawRect(x0, y0, x1, y1, [trackId + 200], color, color);
                    }
                    else {
                        var pos = blackNoteIds.indexOf(note.id);
                        if (pos >= 0) {
                            var x0 = blackNoteSpots[pos] * loc.whiteWidth - loc.blackWidth + 2;
                            var x1 = x0 + 2 * loc.blackWidth - 3;
                            var color = getColorByVelocity(blackNoteColor, note.velocityOn, minMaxVel);
                            loc.input.drawRect(x0, y0, x1, y1, [trackId + 202], color, color);
                        }
                    }
                });
            }
            function drawSustainBackground(loc) {
                if (Musicope.params.s_showSustainBg) {
                    var color = hexToRgb(Musicope.params.s_colSustain);
                    var color2 = hexToRgb(Musicope.params.s_colSustain, 0.5);
                    loc.input.sustainNotes.forEach(function (note) {
                        var y0 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOn + 1;
                        var y1 = loc.yEndOfTimeBar + loc.input.pixelsPerTime * note.timeOff - 2;
                        var ipos = whiteNoteIds.length;
                        loc.input.drawRect(0, y0, loc.input.sceneWidth + 1, y0 + 2, [200], color, color);
                        loc.input.drawRect(0, y1, loc.input.sceneWidth + 1, y1 + 2, [200], color2, color);
                    });
                }
            }
            function drawBlackRails(loc) {
                if (Musicope.params.s_showBlackRails) {
                    blackNoteIds.forEach(function (id, i) {
                        var x0 = blackNoteSpots[i] * loc.whiteWidth - loc.blackWidth + 2;
                        var x1 = x0 + 2 * loc.blackWidth - 3;
                        var y0 = loc.yEndOfPiano;
                        var y1 = loc.input.sceneHeight;
                        var color1 = hexToRgb(Musicope.params.s_colorBlackRails2);
                        var color2 = hexToRgb(Musicope.params.s_colorBlackRails3);
                        var color = (i - 1) % 5 === 0 || (i - 2) % 5 === 0 ? color1 : color2;
                        loc.input.drawRect(x0, y0, x1, y1, [id], color, color);
                    });
                }
            }
            function drawScene(input) {
                var whiteWidth = Math.floor(input.sceneWidth / whiteNoteIds.length);
                var maxRadius = Math.max.apply(null, Musicope.params.p_radiuses);
                var timePerSceneHeigth = input.sceneHeight / input.pixelsPerTime;
                var timeBarHeight = input.sceneHeight * maxRadius / timePerSceneHeigth;
                var yEndOfTimeBar = Math.floor(Musicope.params.s_showPiano ? 0.2 * input.sceneHeight : timeBarHeight);
                var loc = {
                    input: input,
                    whiteWidth: whiteWidth,
                    blackWidth: Math.round(0.25 * whiteWidth),
                    yEndOfTimeBar: yEndOfTimeBar,
                    yEndOfPiano: yEndOfTimeBar - timeBarHeight,
                    xRemainder: input.sceneWidth - whiteWidth * whiteNoteIds.length,
                };
                drawSustainBackground(loc);
                drawBlackRails(loc);
                Musicope.params.s_views.forEach(function (view, i) {
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
            if (Musicope.params.f_normalize) {
                var meanVel = getMeanVelocity(playerTracks);
                var scaleVel = Musicope.params.f_normalize / meanVel;
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
            return Musicope.params.f_trackIds.map(function (trackId) {
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
        var scores = {};
        var scoresDirty = false;
        function sortList() {
            var els = $('.midContainer .el:visible');
            els.sort(function (a, b) {
                var countA = parseInt($(a).find('.vote-count').text());
                var countB = parseInt($(b).find('.vote-count').text());
                if (countB === countA) {
                    var nameA = $(a).find('.elLinkName').text();
                    var nameB = $(b).find('.elLinkName').text();
                    return nameA > nameB ? 1 : -1;
                }
                else {
                    return countB - countA;
                }
            });
            els.detach().appendTo('.midContainer');
        }
        function voteUp(e) {
            var id = $(this).parents('.el').children('.elURL').text().trim();
            var old = parseInt(scores[id] || '0');
            scores[id] = old + 1;
            scoresDirty = true;
            $(this).siblings('.vote-count').text(old + 1);
            e.preventDefault();
        }
        function voteDown(e) {
            var id = $(this).parents('.el').children('.elURL').text().trim();
            var old = parseInt(scores[id] || '0');
            scores[id] = old - 1;
            scoresDirty = true;
            $(this).siblings('.vote-count').text(old - 1);
            e.preventDefault();
        }
        function populateDOM(items, scores) {
            items.forEach(function (item) {
                var title = item.name.replace(".mid", "");
                var path = item.path.replace(item.name, "");
                var score = scores[item.path] || "0";
                var template = $('.song-list-template').html().trim().replace("{{title}}", title).replace("{{path}}", path).replace("{{score}}", score).replace("{{url}}", item.path);
                $(template).appendTo('.midContainer');
            });
            sortList();
        }
        function startSavingScores() {
            setInterval(function () {
                if (scoresDirty) {
                    var text = JSON.stringify(scores, null, 4);
                    scoresDirty = false;
                    Musicope.dropbox.writeFile('settings.json', text);
                }
            }, 1000);
        }
        function initScores() {
            var def = $.Deferred();
            Musicope.dropbox.readFile('settings.json', function (error, data) {
                if (!data) {
                    def.resolve();
                }
                else {
                    scores = JSON.parse(data);
                    def.resolve();
                }
                startSavingScores();
            });
            return def;
        }
        function getAllMidiFiles(client) {
            var files = $.Deferred();
            client.search('songs', '.mid', {}, function (error, entries) {
                files.resolve(entries);
            });
            return files;
        }
        function init() {
            Musicope.dropbox.authenticate(function (error, client) {
                initScores().done(function () {
                    getAllMidiFiles(client).done(function (items) {
                        populateDOM(items, scores);
                        $('.el:visible:first').addClass('elFocus');
                        List.Keyboard.bindKeyboard();
                    });
                });
            });
            $(document).on('click', '.vote-up', voteUp);
            $(document).on('click', '.vote-down', voteDown);
            $(document).on('click', '.elLink', function () {
                var el = $(this).siblings('.elURL');
                if (el.length > 1) {
                    throw "wtf";
                }
                Musicope.params.c_songUrl = $(el[0]).text().trim();
                Mousetrap.reset();
                Musicope.game = new Musicope.Game.Game();
            });
            var lastQuery = "";
            $('#query').data('timeout', null).keyup(function () {
                var _this = this;
                clearTimeout($(this).data('timeout'));
                $(this).data('timeout', setTimeout(function () {
                    var query = $(_this).val();
                    if (query !== lastQuery) {
                        List.filterSongs(query);
                        sortList();
                        List.Keyboard.resetIndex();
                        lastQuery = query;
                    }
                }, 500));
            });
        }
        List.init = init;
    })(List = Musicope.List || (Musicope.List = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var List;
    (function (List) {
        function filterSongsByQueries(queries) {
            var els = $('.el');
            els.each(function (i, item) {
                var url = $(item).find('.elURL').text().trim().toLowerCase();
                var found = queries.every(function (query) {
                    return url.indexOf(query) > -1;
                });
                var display = found ? 'block' : 'none';
                $(item).css('display', display);
            });
        }
        function splitQuery(query) {
            var queries = query.toLowerCase().split(" ");
            var trimmedQueries = queries.map(function (query) {
                return query.trim();
            });
            var nonEmptyQueries = trimmedQueries.filter(function (query) {
                return query != "";
            });
            return nonEmptyQueries;
        }
        function filterSongs(query) {
            var queries = splitQuery(query);
            filterSongsByQueries(queries);
        }
        List.filterSongs = filterSongs;
    })(List = Musicope.List || (Musicope.List = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var List;
    (function (List) {
        var Keyboard;
        (function (Keyboard) {
            function correctPosition() {
                var el = $(".elFocus");
                var rely = el.offset()["top"] - $(window).scrollTop() + 0.5 * el.height();
                if (rely > 0.9 * window.innerHeight) {
                    var dy = window.innerHeight - 1.5 * el.height() - rely;
                    $(window).scrollTop($(window).scrollTop() - dy);
                }
                else if (rely < 0.2 * window.innerHeight) {
                    $(window).scrollTop(el.offset()["top"] - 2 * el.height());
                }
                return true;
            }
            function enter() {
                Mousetrap.bind('enter', function (e) {
                    Musicope.params.c_songUrl = $('.el').filter('.elFocus').find('.elURL').text().trim();
                    Mousetrap.reset();
                    Musicope.game = new Musicope.Game.Game();
                    e.preventDefault();
                });
            }
            function up() {
                Mousetrap.bind('up', function (e) {
                    var oldEl = $('.el').filter('.elFocus');
                    var newEl = oldEl.prev(':visible');
                    if (newEl.length > 0) {
                        oldEl.removeClass('elFocus');
                        newEl.addClass('elFocus');
                        correctPosition();
                    }
                    e.preventDefault();
                });
            }
            function down() {
                Mousetrap.bind('down', function (e) {
                    var oldEl = $('.el').filter('.elFocus');
                    var newEl = oldEl.next(':visible');
                    if (newEl.length > 0) {
                        oldEl.removeClass('elFocus');
                        newEl.addClass('elFocus');
                        correctPosition();
                    }
                    e.preventDefault();
                });
            }
            function resetIndex() {
                $('.elFocus').removeClass('elFocus');
                $('.el:visible:first').addClass('elFocus');
                $(window).scrollTop(0);
            }
            Keyboard.resetIndex = resetIndex;
            function bindKeyboard() {
                down();
                up();
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
        var Options;
        (function (Options) {
            function getOptions() {
            }
            Options.getOptions = getOptions;
        })(Options = List.Options || (List.Options = {}));
    })(List = Musicope.List || (Musicope.List = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Model;
    (function (Model) {
        var Game;
        (function (Game) {
            ;
        })(Game = Model.Game || (Model.Game = {}));
    })(Model = Musicope.Model || (Musicope.Model = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var Model;
    (function (Model) {
        var Game;
        (function (Game) {
            var UserParams;
            (function (UserParams) {
                ;
                ;
                ;
                ;
                ;
                ;
            })(UserParams = Game.UserParams || (Game.UserParams = {}));
        })(Game = Model.Game || (Model.Game = {}));
    })(Model = Musicope.Model || (Musicope.Model = {}));
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
            Musicope.params = jQuery.extend(true, {}, Musicope.defaultParams);
        }
        Params.reset = reset;
        function subscribe(id, regex, callback) {
            subscriptions[id] = {
                regex: new RegExp(regex),
                callback: callback
            };
        }
        Params.subscribe = subscribe;
        function unsubscribe(id) {
            delete subscriptions[id];
        }
        Params.unsubscribe = unsubscribe;
        function setParam(name, value, dontNotifyOthers) {
            Musicope.params[name] = value;
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
    Musicope.defaultParams = {
        // controllers
        c_songUrl: undefined,
        c_driver: "WebMidi",
        c_callbackUrl: undefined,
        // players
        p_deviceIn: "0",
        p_deviceOut: "2",
        p_elapsedTime: undefined,
        p_initTime: undefined,
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
    Musicope.params = jQuery.extend(true, {}, Musicope.defaultParams);
})(Musicope || (Musicope = {}));
//# sourceMappingURL=app.js.map
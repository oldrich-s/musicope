var Musicope;
(function (Musicope) {
    var List;
    (function (List) {
        function startGame(path) {
            var options = List.Options.getOptions();
            location.href = "game";
        }
        List.startGame = startGame;
        function populateDOM(items) {
            items.forEach(function (item) {
                var title = item.name.replace(".mid", "");
                var path = item.path.replace(item.name, "");
                var template = $('.song-list-template').html().trim().replace("{{title}}", title).replace("{{path}}", path).replace("{{url}}", item.path);
                $(template).appendTo('.midContainer');
            });
        }
        function getAllMidiFiles(client) {
            var files = $.Deferred();
            client.search('/', '.mid', {}, function (error, entries) {
                files.resolve(entries);
            });
            return files;
        }
        $(document).ready(function () {
            var items = [];
            var client = new Dropbox.Client({ key: "ckt9l58i8fpcq6d" });
            client.authenticate(function (error, client) {
                getAllMidiFiles(client).done(function (_items) {
                    items = _items;
                    populateDOM(items);
                    List.Keyboard.bindKeyboard();
                });
            });
            $(document).on('click', '.elLink', function () {
                var path = $(this).siblings('.elURL').text().trim();
                startGame(path);
            });
            var lastQuery = "";
            $('#query').data('timeout', null).keyup(function () {
                var _this = this;
                clearTimeout($(this).data('timeout'));
                $(this).data('timeout', setTimeout(function () {
                    var query = $(_this).val();
                    if (query !== lastQuery) {
                        List.filterSongs(query, items);
                        List.Keyboard.resetIndex();
                        lastQuery = query;
                    }
                }, 500));
            });
        });
    })(List = Musicope.List || (Musicope.List = {}));
})(Musicope || (Musicope = {}));
var Musicope;
(function (Musicope) {
    var List;
    (function (List) {
        function filterSongsByQueries(items, queries) {
            var els = $('.el');
            items.forEach(function (item, i) {
                var url = item.path.toLowerCase();
                var found = queries.every(function (query) {
                    return url.indexOf(query) > -1;
                });
                var display = found ? 'block' : 'none';
                $(els[i]).css('display', display);
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
        function filterSongs(query, items) {
            var queries = splitQuery(query);
            filterSongsByQueries(items, queries);
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
            var index = 0;
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
            function enter(els) {
                Mousetrap.bind('enter', function (e) {
                    var path = $(els[index]).find('.elURL').text().trim();
                    List.startGame(path);
                    e.preventDefault();
                });
            }
            function up(els) {
                Mousetrap.bind('up', function (e) {
                    for (var i = index - 1; i >= 0; i--) {
                        if (els[i].style.display !== 'none') {
                            els.removeClass('elFocus');
                            $(els[i]).addClass('elFocus');
                            index = i;
                            break;
                        }
                    }
                    correctPosition();
                    e.preventDefault();
                });
            }
            function down(els) {
                Mousetrap.bind('down', function (e) {
                    for (var i = index + 1; i < els.length; i++) {
                        if (els[i].style.display !== 'none') {
                            els.removeClass('elFocus');
                            $(els[i]).addClass('elFocus');
                            index = i;
                            break;
                        }
                    }
                    correctPosition();
                    e.preventDefault();
                });
            }
            function resetIndex() {
                var els = $('.el');
                index = $('.el:visible:first').index();
                els.removeClass('elFocus');
                $(els[index]).addClass('elFocus');
                $(window).scrollTop(0);
            }
            Keyboard.resetIndex = resetIndex;
            function bindKeyboard() {
                var els = $('.el');
                $('.el').first().addClass('elFocus');
                down(els);
                up(els);
                enter(els);
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
//# sourceMappingURL=_app.js.map
# Introduction

Musicope is an open-source online piano game. You can play the game or find further information at the [Musicope][6] website. Notice, that currently, you must have [Jazz plug-in][9] installed to play the game. It must be stressed, that Musicope is in its **alpha** phase with a lot of bugs, lack of features and lack of documentation. You are therefore more than welcome to contribute! You can enhance the Musicope [website][6], [file a bug][7], or discuss the game in the Musicope [forum][8]. Any type of contribution is welcome!

The aim of the introduction is to give a brief overview of the game logic and source structure. The game consists of two separate views - [Game view][1] and [List view][2].

## [Game View][1]

Game View is the core of the game. It behaves as a completely separate web-page. You can therefore start the Game View separately by calling a single URL link such as [thisone][4]. 

All the input parameters of the game are served by means of the *GET* parameters. The only required parameter is *g_songUrl*. Other parameters have their respective default [values][5]. The current list of all the possible parameters of the Game View can be found [here][3]. The Game View does not store any data anywhere. Everything goes in and out by means of the *GET* parameters.

All the input *GET* parameters can be theoretically modified during the game play. An example of the modification of the input parameters during the game play are the different [keyboard actions][10] currently implemented. You can try to hit *up key*, *down key*, *left key*, *right key*, *m*, *h*, *w* and others during the game play and see what happens :). Or you can study all the keyboard options [here][10].

## [List View][2]

List View is a supporting view for the Game View. This view isn't in fact necessary at all and can be replaced by any other web-page. The main task of the List View is to parse a *json* list of available *midi* files, and provide it to the user. The user chooses the song of interest together with input parameters and plays the game. Simple :). Currently, there is only one input *GET* [parameter][11] of the List view, namely *l_songsUrl* which should point to the *json* url.

## Source Code description

The source of the Musicope is written in [TypeScript][13]. TypeScript is JavaScript with types. You can use e.g. free [Microsoft Visual Studio Express for Web][14] to edit the TypeScript files.

As mentioned, the game consist of two separate views (Game View and List View). Each view consists of the main [index.html][12], [index.css][17] and [_index.ts][15] file. All the TypeScript files are loaded dynamically by [RequireJS][16]. The interface of the input *GET* parameters is contained in [_paramsInterfaces.ts][18] whereas their respective default values can be found in [_paramsDefault.ts][19]. All the interfaces are loaded by *reference* tags.

All the views consist of plugins. Each plugin is contained in separate folder. Let's take [scenes][20] plugin as an example. Each plugin consists of [_interfaces.ts][21] which defines the interface of the plugin Class. Each plugin further contains [_load.ts][22] file which loads all the plugins of the specified interface. Whenever you create a plugin for a specified interface, place your plugin reference into the respective *_load.ts*.




[1]: https://github.com/musicope/game/tree/master/Musicope/web/game
[2]: https://github.com/musicope/game/tree/master/Musicope/web/list
[3]: https://github.com/musicope/game/blob/master/Musicope/web/game/_paramsInterfaces.ts
[4]: http://piano.musicope.com/game/index.html?g_songUrl=../songs/G%20Major%20Music/0.0%20-%20First%20Pieces/A%20Tisket,%20A%20Tasket.mid&
[5]: https://github.com/musicope/game/blob/master/Musicope/web/game/_paramsDefault.ts
[6]: http://musicope.com/
[7]: https://github.com/musicope/game/issues
[8]: http://qa.musicope.com/
[9]: http://jazz-soft.net/
[10]: https://github.com/musicope/game/tree/master/Musicope/web/game/inputs/keyboard/actions
[11]: https://github.com/musicope/game/blob/master/Musicope/web/list/_paramsInterfaces.ts
[12]: https://github.com/musicope/game/blob/master/Musicope/web/game/index.html
[13]: http://www.typescriptlang.org/
[14]: http://www.microsoft.com/visualstudio/eng/products/visual-studio-express-for-web
[15]: https://github.com/musicope/game/blob/master/Musicope/web/game/_index.ts
[16]: http://requirejs.org/
[17]: https://github.com/musicope/game/blob/master/Musicope/web/game/index.css
[18]: https://github.com/musicope/game/blob/master/Musicope/web/game/_paramsInterfaces.ts
[19]: https://github.com/musicope/game/blob/master/Musicope/web/game/_paramsDefault.ts
[20]: https://github.com/musicope/game/tree/master/Musicope/web/game/scenes
[21]: https://github.com/musicope/game/blob/master/Musicope/web/game/scenes/_interfaces.ts
[22]: https://github.com/musicope/game/blob/master/Musicope/web/game/scenes/_load.ts
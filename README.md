# Introduction

Musicope is an open-source online piano game. You find further information about the game at the Musicope [website][6]. Notice, that you must have [Jazz plug-in][9] installed in order to be able to play the game! 

Musicope is in its **alpha** phase with a lot of bugs, lack of features and lack of documentation. You are therefore more than welcome to contribute! You can either enhance the [source code][24], you can [file a bug][7], or you can discuss the game at the Musicope [forum][8]. Any type of contribution is welcome!

In the following a brief overview of the game logic and source structure will be given. The game consists of two separate views, [Game view][1] and [List view][2].

## Game View

[Game View][1] is the core of the game. It behaves as a completely separate web-page. You can therefore start the Game View separately by calling a single URL link such as [thisone][4]. 

All the input parameters of the game are served by means of the *GET* parameters. The current list of all the possible parameters of the Game View can be found [here][3]. The only required parameter is *c_songUrl*. All the other parameters have their respective default [values][5]. The Game View does not store any data. Everything goes in and out by means of the *GET* parameters.

All the input *GET* parameters can be theoretically modified during the game play. An example of the modification of the input parameters during the game play are the different [keyboard actions][10] currently implemented. You can try to hit *up key*, *down key*, *left key*, *right key*, *m*, *h*, *w* and others during the game play and see what happens :). Or you can study all the keyboard options [here][10].

## List View

[List View][2] is a supporting view for the Game View. This view isn't in fact necessary at all and can be replaced by any other web-page. The main task of the List View is to parse a *json* list of available *midi* files, and provide it to the user. The user chooses the song of interest together with input parameters and plays the game. Simple :). Currently, there is only one input *GET* [parameter][11] of the List view, namely *l_songsUrl* which should point to the *json* url.

## Source Code description

The source of the Musicope is written in [TypeScript][13]. TypeScript is JavaScript with types. You can use e.g. free [Microsoft Visual Studio Express for Web][14] to edit the TypeScript files.

As mentioned, the game consist of two separate views (Game View and List View). Each view consists of the main [index.html][12], [index.css][17] and [_index.ts][15] file. All the TypeScript files are loaded dynamically by [RequireJS][16]. The interface of the input *GET* parameters is contained in [_paramsInterfaces.ts][18] whereas their respective default values can be found in [_paramsDefault.ts][19]. All the interfaces are loaded by [ _references.ts][23].

All the views consist of plugins. Each plugin is contained in separate folder. Let's take [scenes][20] plugin as an example. Each plugin consists of [_interfaces.ts][21] which defines the interface of the plugin Class. Each plugin further contains [_load.ts][22] file which loads all the plugins of the specified interface. Whenever you create a plugin for a specified interface, place your plugin reference into the respective *_load.ts*.




[1]: https://github.com/musicope/game/tree/master/src/Musicope/website/game
[2]: https://github.com/musicope/game/tree/master/src/Musicope/website/list
[3]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/_paramsInterfaces.ts
[4]: http://piano.musicope.com/game/index.html?c_songUrl=../songs/G%20Major%20Music/0.0%20-%20First%20Pieces/A%20Tisket,%20A%20Tasket.mid&
[5]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/_paramsDefault.ts
[6]: http://musicope.com/
[7]: https://github.com/musicope/game/issues
[8]: http://qa.musicope.com/
[9]: http://jazz-soft.net/
[10]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/inputs/keyboard/actions
[11]: https://github.com/musicope/game/tree/master/src/Musicope/website/list/_paramsInterfaces.ts
[12]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/index.html
[13]: http://www.typescriptlang.org/
[14]: http://www.microsoft.com/visualstudio/eng/products/visual-studio-express-for-web
[15]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/_index.ts
[16]: http://requirejs.org/
[17]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/index.css
[18]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/_paramsInterfaces.ts
[19]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/_paramsDefault.ts
[20]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/scenes
[21]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/scenes/_interfaces.ts
[22]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/scenes/_load.ts
[23]: https://github.com/musicope/game/tree/master/src/Musicope/website/game/_references.ts
[24]: https://github.com/musicope/game/tree/master/src/Musicope/website
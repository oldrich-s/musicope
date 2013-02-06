# Introduction

Musicope is an open-source online piano game. You can play the game or find further information at the [Musicope][6] website. Notice, that currently, you must have [Jazz plug-in][9] installed to play the game. It must be stressed, that Musicope is in its **alpha** phase with a lot of bugs, lack of features and lack of documentation. You are therefore more than welcome to contribute! You can enhance the Musicope [website][6], [file a bug][7], or discuss the game in the Musicope [forum][8]. Any type of contribution is welcome!

The aim of the introduction is to give a brief overview of the game logic and source structure. The game consists of two separate views - [Game view][1] and [List view][2].

## [Game View][1]

Game View is the core of the game. It behaves as a completely separate web-page. You can therefore start the Game View separately by calling a single URL link such as [thisone][4]. 

All the input parameters of the game are served by means of the *GET* parameters. The only required parameter is *g_songUrl*. Other parameters have their respective default [values][5]. The current list of all the possible parameters of the Game View can be found [here][3]. The Game View does not store any data anywhere. Everything goes in and out by means of the *GET* parameters.

All the input *GET* parameters can be theoretically modified during the game play. An example of the modification of the input parameters during the game play are the different [keyboard actions][10] currently implemented. You can try to hit *up key*, *down key*, *left key*, *right key*, *m*, *h*, *w* and others during the game play and see what happens :). Or you can study all the keyboard options [here][10].

## [List View][2]



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
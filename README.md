# Introduction

Musicope is an open-source online piano game. You can play the game or find further information at the [Musicope][6] website. Notice, that currently, you must have [Jazz plug-in][9] installed to play the game.

The aim of the introduction is to give a brief overview of the game logic and source structure. You are more than welcome to contribute to the source, [file a bug][7], or discuss the game in the Musicope [forum][8].

The game consists of two separate views - [Game view][1] and [List view][2].

## Game View

Game View is the core game itself. It behaves as a completely separate website. You can therefore run the Game View by a single URL link such as [thisone][4]. 

All the input parameters of the game are served by means of the *GET* parameters. The only required parameter is *g_songUrl*. Other parameters have their respective default [value][5]. The current list of all the possible parameters of the Game View can be found [here][3]. The Game View does not store any data anywhere. Everything goes in and out by means of the *GET* parameters.

## List View

[1]: https://github.com/musicope/game/tree/master/Musicope/web/game
[2]: https://github.com/musicope/game/tree/master/Musicope/web/list
[3]: https://github.com/musicope/game/blob/master/Musicope/web/game/_paramsInterfaces.ts
[4]: http://piano.musicope.com/game/index.html?g_songUrl=../songs/G%20Major%20Music/0.0%20-%20First%20Pieces/A%20Tisket,%20A%20Tasket.mid&
[5]: https://github.com/musicope/game/blob/master/Musicope/web/game/_paramsDefault.ts
[6]: http://musicope.com/
[7]: https://github.com/musicope/game/issues
[8]: http://qa.musicope.com/
[9]: http://jazz-soft.net/
# Welcome to musicope
Musicope is an open-source online piano game similar to [Synthesia](http://synthesiagame.com/) or [PianoCrumbs](http://www.pianocrumbs.com/piano/). 

[![Mutable.ai Auto Wiki](https://img.shields.io/badge/Auto_Wiki-Mutable.ai-blue)](https://wiki.mutable.ai/oldrich-s/musicope)

## Installation
### Dependencies
* Git (optional)
* nodejs
* npm
* a Web Browser

### Installation
1. install NodeJS ( https://nodejs.org/en/ )
2. clone or download this repository
3. navigate to the cloned or downloaded folder
4. copy `mid` files into `static/songs`
5. run `npm install`
6. run `npm start`
7. open your browser (e.g. Google Chrome) and navigate to http://localhost
8. modify `\static\web\config\default-config.ts` according to your needs

## Play the game
1. Get a midi file
2. Copy it into `static/songs`
3. Go to http://localhost with Chrome (not working using firefox)
4. Click on the song to play

## Contribution
You want to contribute to this project ?
### Fork a repertory
1. Click on **fork**
2. Run :
```
git clone https://github.com/YOUR_USERNAME/musicope/
```
3. Make changes then run :
```
git init
git add .
git commit -m "Commit"
git remote add origin https://github.com/YOUR_USERNAME/musicope/
git push -u origin master
```

(or change directly in the browser)

#### Submit pull request
4. Go on your project and **create a pull request**
5. You will be noticed if someone merged your project

### Submit an issue
1. Click on issue > New
2. Detail your problem / feature request then submit
3. Discuss it
4. Then click on "close" when the discussion ended.

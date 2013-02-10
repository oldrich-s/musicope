/// <reference path="_references.ts" />

import jasmine = module("./jasmine");
jasmine.start();

import metronome = module("./metronomes/basic/_main");
metronome.run();
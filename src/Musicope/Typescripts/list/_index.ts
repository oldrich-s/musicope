/// <reference path="_references.ts" />

import controllers = module("./controllers/_load");

ko.applyBindings(new controllers.Basic());
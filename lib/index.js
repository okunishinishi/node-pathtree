/**
 * Node.js module to print path tree.
 * [module pathtree
 */

"use strict";

var Pathtree = require('./pathtree'),
    create = require('./create');

var pathtree = create({});
var lib = pathtree.bundle();
lib.create = create;
lib.Pathtree = Pathtree;
module.exports = lib;

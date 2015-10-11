/**
 * @function create
 */

"use strict";

var Pathtree = require('./pathtree');

/** @lends create */
function create(config) {
    return new Pathtree(config);
}

module.exports = create;

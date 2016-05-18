/**
 * @function create
 */

'use strict'

const Pathtree = require('./pathtree')

/** @lends create */
function create (config) {
  return new Pathtree(config)
}

module.exports = create

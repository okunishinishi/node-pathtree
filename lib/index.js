/**
 * Node.js module to print path tree.
 * [module pathtree
 */

'use strict'

const Pathtree = require('./pathtree')
const create = require('./create')

let pathtree = create({})
let lib = pathtree.bundle()

Object.assign(lib, pathtree, {
  create,
  Pathtree
})

module.exports = lib

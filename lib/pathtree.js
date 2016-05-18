/**
 * @constructor Pathtree
 */

'use strict'

const co = require('co')
const { EOL } = require('os')
const _nodeStrings = require('./_node_strings')
const _filesInDir = require('./_files_in_dir')
const arrayreduce = require('arrayreduce')
const arraysort = require('arraysort')

/** @lends Pathtree */
function Pathtree (config) {
  const s = this
  Object.assign(s, config)
}

Pathtree.prototype = {
  separator: /\//g,
  inspect (dirname = '.', options = {}) {
    const s = this
    let ignore = [].concat(options.ignore || []).map((ignore) =>
      ignore.replace(/\/$/, '').replace(/^\//, '')
    )
    return co(function * () {
      let pathnames = yield _filesInDir(dirname, {
        ignore: ignore,
        cwd: options.cwd || process.cwd()
      })
      s.print(pathnames, dirname)
      return pathnames
    })
  },
  print (pathnames, root) {
    const s = this
    return console.log(s.toString(pathnames, root))
  },
  toString (pathnames, root) {
    const s = this
    let organized = s._organize(pathnames)
    let lines = _nodeStrings(organized).join(EOL) + EOL
    if (root) {
      return [ root, lines ].join(EOL)
    }
    return lines
  },
  bundle () {
    const s = this
    let inspect = s.inspect.bind(s)
    let print = s.print.bind(s)
    let toString = s.toString.bind(s)
    let bound = inspect.bind(s)
    bound.print = print
    bound.toString = toString
    return bound
  },
  _organize (pathnames) {
    const s = this
    let result = {}
    pathnames = [].concat(pathnames || [])
    pathnames
      .reduce(arrayreduce.arrayConcat(), [])
      .sort(arraysort.stringCompare())
      .forEach((line) => {
        let pushing = result
        line.split(s.separator).forEach((item) => {
          pushing[ item ] = pushing[ item ] || {}
          pushing = pushing[ item ]
        })
      })
    return result
  }
}

module.exports = Pathtree

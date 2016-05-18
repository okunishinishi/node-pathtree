/**
 * @function _filesInDir
 * @private
 */

'use strict'

const minimatch = require('minimatch')
const path = require('path')
const fs = require('fs')
const co = require('co')

/** @lends _filesInDir */
function _filesInDir (dirname = '.', options = {}) {
  let cwd = options.cwd || process.cwd()
  let ignore = [].concat(options.ignore || [])
  ignore.push('.*')

  return co(function * () {
    dirname = path.resolve(cwd, dirname)

    let filenames = yield new Promise((resolve, reject) =>
      fs.readdir(dirname, (err, filenames) => err ? reject(err) : resolve(filenames))
    )
    filenames = filenames.filter((filename) => {
      for (var i = 0; i < ignore.length; i++) {
        var hit = minimatch(filename, ignore[ i ]) || minimatch(path.join(dirname, filename), ignore[ i ])
        if (hit) {
          return false
        }
      }
      return true
    }).map((filename) => path.join(dirname, filename))
    let results = []
    for (let filename of filenames) {
      let exists = yield new Promise((resolve) =>
        fs.exists(filename, (exists) => resolve(exists))
      )
      if (!exists) {
        continue
      }
      let state = yield new Promise((resolve, reject) =>
        fs.stat(filename, (err, state) =>
          err ? reject(err) : resolve(state)
        )
      )
      let isDir = state.isDirectory()
      if (isDir) {
        let result = yield _filesInDir(filename, options)
        results = results.concat(result)
      } else {
        results = results.concat(filename)
      }
    }
    return results.map((filename) => path.relative(cwd, filename))
  })
}

module.exports = _filesInDir

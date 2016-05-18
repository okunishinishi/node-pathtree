/**
 * @function _nodeStrings
 * @private
 */
'use strict'

const arrayreduce = require('arrayreduce')

/** @lends _nodeStrings */
function _nodeStrings (data, name) {
  let keys = Object.keys(data)
  if (keys.length) {
    let lines = []
    if (name) {
      lines.push(name)
    }
    return lines.concat(
      keys
        .map((key) => _nodeStrings(data[ key ], key))
        .map((lines, i) => {
          let hasNext = i < keys.length - 1
          return lines.map((line) => {
            let joiner
            let hasParent = line.match('├──') || line.match('└──')
            if (hasParent) {
              joiner = hasNext ? '│  ' : '    '
            } else {
              joiner = hasNext ? '├──' : '└──'
            }
            return [ joiner, line ].join(' ')
          })
        }).reduce(arrayreduce.arrayConcat(), [])
    )
  } else {
    return [ name ]
  }
}

module.exports = _nodeStrings

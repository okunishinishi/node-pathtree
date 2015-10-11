/**
 * @function _nodeStrings
 * @private
 */
"use strict";

var arrayreduce = require('arrayreduce');

/** @lends _nodeStrings */
function _nodeStrings(data, name) {
    var keys = Object.keys(data);
    if (keys.length) {
        var lines = [];
        if (name) {
            lines.push(name);
        }
        return lines.concat(
            keys
                .map(function (key) {
                    return _nodeStrings(data[key], key);
                })
                .map(function (lines, i) {
                    var hasNext = i < keys.length - 1;
                    return lines.map(function (line) {
                        var joiner;
                        var hasParent = line.match('├──') || line.match('└──');
                        if (hasParent) {
                            joiner = hasNext ? '│  ' : '    ';
                        } else {
                            joiner = hasNext ? '├──' : '└──';
                        }
                        return [joiner, line].join(' ');
                    });
                }).reduce(arrayreduce.arrayConcat(), [])
        );
    } else {
        return [name];
    }
}

module.exports = _nodeStrings;

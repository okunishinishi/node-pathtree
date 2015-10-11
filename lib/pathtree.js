/**
 * @constructor Pathtree
 */

"use strict";

var extend = require('extend'),
    os = require('os'),
    fs = require('fs'),
    argx = require('argx'),
    path = require('path'),
    expandglob = require('expandglob'),
    async = require('async'),
    objnest = require('objnest'),
    minimatch = require('minimatch'),
    arrayreduce = require('arrayreduce'),
    arraysort = require('arraysort');

/** @lends Pathtree */
function Pathtree(config) {
    var s = this;
    extend(s, config);
}

Pathtree.prototype = {
    separator: /\//g,
    inspect: function (dirname, options, callback) {
        var args = argx(arguments);
        dirname = args.shift('string') || '.';
        callback = args.pop('function') || argx.noop;
        options = args.pop('object') || {};
        var s = this;

        var pattern = path.join(dirname, options.pattern || '**/*.*');
        var ignore = [].concat(options.ignore || []).map(function (ignore) {
            if (!/\*/.test(ignore)) {
                ignore = path.join(ignore, '**/*.*');
            }
            return ignore;
        });
        async.waterfall([
            function (callback) {
                expandglob(pattern, {
                    ignore: ignore,
                    cwd: options.cwd || process.cwd()
                }, callback);
            },
            function (pathanmes, callback) {
                pathanmes = pathanmes.map(function (pathname) {
                    return path.relative(dirname, pathname);
                });
                s.print(pathanmes, dirname);
                callback(null);
            }
        ], callback)
    },
    print: function (pathnames, root) {
        var s = this;
        return console.log(s.toString(pathnames, root));
    },
    toString: function (pathnames, root) {
        var s = this;
        var organized = s._organize(pathnames);

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

        var lines = _nodeStrings(organized).join(os.EOL) + os.EOL;
        if (root) {
            return [root, lines].join(os.EOL);
        }
        return lines;
    },
    bundle: function () {
        var s = this;
        var inspect = s.inspect.bind(s),
            print = s.print.bind(s),
            toString = s.toString.bind(s),
            bound = inspect.bind(s);
        bound.print = print;
        bound.toString = toString;
        return bound;
    },
    _organize: function (pathnames) {
        var s = this,
            result = {};
        [].concat(pathnames || [])
            .reduce(arrayreduce.arrayConcat(), [])
            .sort(arraysort.stringCompare())
            .forEach(function (line) {
                var pushing = result;
                line.split(s.separator).forEach(function (item) {
                    pushing[item] = pushing[item] || {};
                    pushing = pushing[item];
                })
            });
        return result;
    }
};

module.exports = Pathtree;

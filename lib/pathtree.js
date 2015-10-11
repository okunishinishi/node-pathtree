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
    _nodeStrings = require('./_node_strings'),
    async = require('async'),
    _filesInDir = require('./_files_in_dir'),
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

        var ignore = [].concat(options.ignore || []);
        async.waterfall([
            function (callback) {
                _filesInDir(dirname, {
                    ignore: ignore,
                    cwd: options.cwd || process.cwd()
                }, callback);
            },
            function (pathanmes, callback) {
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

/**
 * @function _filesInDir
 * @private
 */

"use strict";

var argx = require('argx'),
    minimatch = require('minimatch'),
    async = require('async'),
    path = require('path'),
    fs = require('fs');

/** @lends _filesInDir */
function _filesInDir(dirname, options, callback) {
    var args = argx(arguments);
    dirname = args.shift('string') || '.';
    callback = args.pop('function') || argx.noop;
    options = args.pop('object') || {};

    var cwd = options.cwd || process.cwd();
    var ignore = [].concat(options.ignore || []);

    ignore.push('.*');
    dirname = path.resolve(cwd, dirname);
    async.waterfall([
        function (callback) {
            fs.readdir(dirname, callback);
        },
        function (filenames, callback) {
            filenames = filenames.filter(function (filename) {
                for (var i = 0; i < ignore.length; i++) {
                    var hit = minimatch(filename, ignore[i]) || minimatch(path.join(dirname, filename), ignore[i]);
                    if (hit) {
                        return false;
                    }
                }
                return true;
            });
            callback(null, filenames);
        },
        function (filenames, callback) {
            async.concatSeries(filenames, function (filename, callback) {
                filename = path.join(dirname, filename);
                fs.exists(filename, function (exists) {
                    if (exists) {
                        fs.stat(filename, function (err, state) {
                            var isDir = !err && state.isDirectory();
                            if (isDir) {
                                _filesInDir(filename, options, callback);
                            } else {
                                callback(null, filename);
                            }
                        });
                    } else {
                        callback(null, [filename]);
                    }
                }, callback);
            }, callback);
        },
        function (fileanmes, callback) {
            fileanmes = fileanmes.map(function (filename) {
                return path.relative(cwd, filename);
            });
            callback(null, fileanmes);
        }
    ], callback);
}

module.exports = _filesInDir;

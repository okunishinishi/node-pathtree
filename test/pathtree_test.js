/**
 * Test case for pathtree.
 * Runs with nodeunit.
 */

var Pathtree = require('../lib/pathtree.js');

exports.setUp = function (done) {
    done();
};

exports.tearDown = function (done) {
    done();
};

exports['To string'] = function (test) {
    var values = new Pathtree().toString([
        'foo',
        'foo/bar',
        'foo/bar/baz',
        'foo/bar/quz',
        'foo/quzz',
        'foo/quzz/quzzz',
        'zzz/bar/baz',
        'zzz/bar/quz'
    ], '.');
    test.ok(values);
    test.done();
};

exports['Do inspect'] = function (test) {
    new Pathtree().inspect(".", {
        ignore: [
            'node_modules'
        ],
        cwd: __dirname + '/..'
    }, function (err) {
        test.ifError(err);
        test.done();
    });
};
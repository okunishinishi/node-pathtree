/**
 * Test case for create.
 * Runs with nodeunit.
 */

var create = require('../lib/create.js');

exports.setUp = function (done) {
    done();
};

exports.tearDown = function (done) {
    done();
};

exports['Create'] = function (test) {
    var bound = create({}).bundle();
    test.ok(bound);
    bound.print([
        'foo/bar'
    ], 'baz');
    test.done();
};


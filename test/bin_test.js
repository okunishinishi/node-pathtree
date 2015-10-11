"use strict";


var bin = require.resolve('../bin/pathtree'),
    childProcess = require('child_process');

exports['Do inspect.'] = function (test) {
    childProcess.exec(bin + ' . -I node_modules', function (err, stdout, sdterr) {
        test.ifError(err);
        console.log(stdout);
        test.done();
    });
};
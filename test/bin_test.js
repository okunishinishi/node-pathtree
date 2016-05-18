'use strict'

const bin = require.resolve('../bin/pathtree')
const childProcess = require('child_process')
const co = require('co')
const assert = require('assert')

describe('bin', function () {
  it('Do inspect.', () => co(function * () {
    let stdout = yield new Promise((resolve, reject) => {
      childProcess.exec(bin + ' . -I node_modules', (err, stdout, sdterr) => {
        assert.ifError(err)
        err ? reject(err) : resolve(stdout)
      })
    })
    console.log(stdout)
  }))
})

/* global describe, it */

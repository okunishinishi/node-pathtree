/**
 * Test case for pathtree.
 * Runs with mocha.
 */
'use strict'

const Pathtree = require('../lib/pathtree.js')
const assert = require('assert')
const co = require('co')

describe('pathtree', function () {
  it('To string', () => co(function * () {
    let values = new Pathtree().toString([
      'foo',
      'foo/bar',
      'foo/bar/baz',
      'foo/bar/quz',
      'foo/quzz',
      'foo/quzz/quzzz',
      'zzz/bar/baz',
      'zzz/bar/quz'
    ], '.')
    assert.ok(values)
  }))

  it('Do inspect', () => co(function * () {
    let pathtree = new Pathtree()
    yield pathtree.inspect('.', {
      ignore: [
        'node_modules'
      ],
      cwd: __dirname + '/..'
    })
  }))
})

/* global describe, it */
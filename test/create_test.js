/**
 * Test case for create.
 * Runs with mocha.
 */
'use strict'

const create = require('../lib/create.js')
const assert = require('assert')
const co = require('co')

describe('create', function () {
  it('Create', () => co(function * () {
    let bound = create({}).bundle()
    assert.ok(bound)
    bound.print([
      'foo/bar'
    ], 'baz')
  }))
})

/* global describe, it */

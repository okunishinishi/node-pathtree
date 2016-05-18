'use strict'

const pathtree = require('pathtree')

pathtree('.', {
  ignore: 'node_modules'
}).then(() => {
  /* ... */
})

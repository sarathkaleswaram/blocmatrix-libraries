'use strict'
var assert = require('assert-diff')
var fixture = require('./fixtures/payment-iou-multipath.json')
var getAffectedAccounts = require('../src').getAffectedAccounts

var accounts = [
  'b4nmQNH4Fhjfh6cHDrvVSsBv7KySrj4cBf',
  'bbnsYgWn13Z28GtRgznbSUsLfMkvsXCZSu',
  'bJsaPnGdeo7BhMnHjuc3n44Mf7Ra1qkSVJ',
  'bGpeQzUWFu4fMhJHZ1Via5aqFC3A5twZUD',
  'bnYDWQaRdMr5neCGgvFfhw3MBoxmv5LtfH'
]

describe('getAffectedAccounts', function() {
  it('Multipath payment', function() {
    var result = getAffectedAccounts(fixture.result.meta)
    assert.deepEqual(result, accounts)
  })
})

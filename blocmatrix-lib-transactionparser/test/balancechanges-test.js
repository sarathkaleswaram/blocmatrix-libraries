'use strict'

var assert = require('assert-diff')
var fs = require('fs')
var parseBalanceChanges = require('../src/index').parseBalanceChanges

// Pay 100 BMC from rKmB to rLDY to create rLDY account
var createAccountBalanceChanges = {
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      value: '100',
      currency: 'BMC',
      counterparty: ''
    }
  ],
  bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc: [
    {
      value: '-100.012',
      currency: 'BMC',
      counterparty: ''
    }
  ]
}

// Pay 0.01 USD from rKmB to rLDY where rLDY starts with no USD
var usdFirstPaymentBalanceChanges = {
  bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc: [
    {
      value: '-0.01',
      currency: 'USD',
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
    },
    {
      value: '-0.012',
      currency: 'BMC',
      counterparty: ''
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      counterparty: 'bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc',
      currency: 'USD',
      value: '0.01'
    },
    {
      counterparty: 'bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K',
      currency: 'USD',
      value: '-0.01'
    }
  ],
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      currency: 'USD',
      value: '0.01'
    }
  ]
}

// Pay 0.2 USD from rLDY to rKmB where rLDY starts with 0.2 USD
var usdFullPaymentBalanceChanges = {
  bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc: [
    {
      value: '0.2',
      currency: 'USD',
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      value: '-0.2',
      currency: 'USD',
      counterparty: 'bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc'
    },
    {
      value: '0.2',
      currency: 'USD',
      counterparty: 'bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K'
    }
  ],
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      value: '-0.2',
      currency: 'USD',
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
    },
    {
      value: '-0.012',
      currency: 'BMC',
      counterparty: ''
    }
  ]
}

// Pay 0.01 USD from rKmB to rLDY where rLDY starts with 0.01 USD
var usdPaymentBalanceChanges = usdFirstPaymentBalanceChanges

// Set trust limit to 200 USD on rLDY when it has a trust limit of 100 USD
// and has a balance of 0.02 USD
var setTrustlineBalanceChanges = {
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      value: '-0.012',
      currency: 'BMC',
      counterparty: ''
    }
  ]
}

var setTrustlineBalanceChanges2 = {
  bsApBGKJmMfExxZBbGnzxEXyq7TMhMRg4e: [
    {
      counterparty: '',
      currency: 'BMC',
      value: '-0.00001'
    }
  ]
}

// Set trust limit to 100 USD with balance of 10 USD
// on rLDY when it has no trustline
var createTrustlineBalanceChanges = {
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      currency: 'USD',
      value: '10'
    },
    {
      counterparty: '',
      currency: 'BMC',
      value: '-0.012'
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      counterparty: 'bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K',
      currency: 'USD',
      value: '-10'
    }
  ]
}


// Pay 0.02 USD from rLDY to rKmB when rLDY has a trust limit of 0
// for USD, but still has a balance of 0.02 USD; which closes the trustline
var deleteTrustlineBalanceChanges = {
  bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc: [
    {
      value: '0.02',
      currency: 'USD',
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      value: '-0.02',
      currency: 'USD',
      counterparty: 'bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc'
    },
    {
      value: '0.02',
      currency: 'USD',
      counterparty: 'bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K'
    }
  ],
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      value: '-0.02',
      currency: 'USD',
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
    },
    {
      value: '-0.012',
      currency: 'BMC',
      counterparty: ''
    }
  ]
}

var redeemBalanceChanges = {
  bHr9CJAWyB4bj91VRWn96DkukG4rwdtyTh: [
    {
      currency: 'USD',
      counterparty: 'bPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK',
      value: '100'
    }
  ],
  bPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK: [
    {
      currency: 'USD',
      counterparty: 'bHr9CJAWyB4bj91VRWn96DkukG4rwdtyTh',
      value: '-100'
    },
    {
      currency: 'BMC',
      counterparty: '',
      value: '-0.00001'
    }
  ]
}

var redeemThenIssueBalanceChanges = {
  bHr9CJAWyB4bj91VRWn96DkukG4rwdtyTh: [
    {
      currency: 'USD',
      counterparty: 'bPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK',
      value: '200'
    }
  ],
  bPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK: [
    {
      currency: 'USD',
      counterparty: 'bHr9CJAWyB4bj91VRWn96DkukG4rwdtyTh',
      value: '-200'
    },
    {
      currency: 'BMC',
      counterparty: '',
      value: '-0.00001'
    }
  ]
}

var multipathBalanceChanges = {
  bbnsYgWn13Z28GtRgznbSUsLfMkvsXCZSu: [
    {
      counterparty: 'b4nmQNH4Fhjfh6cHDrvVSsBv7KySrj4cBf',
      currency: 'USD',
      value: '100'
    },
    {
      counterparty: 'bnYDWQaRdMr5neCGgvFfhw3MBoxmv5LtfH',
      currency: 'USD',
      value: '-100'
    }
  ],
  b4nmQNH4Fhjfh6cHDrvVSsBv7KySrj4cBf: [
    {
      counterparty: 'bbnsYgWn13Z28GtRgznbSUsLfMkvsXCZSu',
      currency: 'USD',
      value: '-100'
    },
    {
      counterparty: '',
      currency: 'BMC',
      value: '-0.00001'
    },
    {
      counterparty: 'bJsaPnGdeo7BhMnHjuc3n44Mf7Ra1qkSVJ',
      currency: 'USD',
      value: '-100'
    },
    {
      counterparty: 'bGpeQzUWFu4fMhJHZ1Via5aqFC3A5twZUD',
      currency: 'USD',
      value: '-100'
    }
  ],
  bJsaPnGdeo7BhMnHjuc3n44Mf7Ra1qkSVJ: [
    {
      counterparty: 'b4nmQNH4Fhjfh6cHDrvVSsBv7KySrj4cBf',
      currency: 'USD',
      value: '100'
    },
    {
      counterparty: 'bnYDWQaRdMr5neCGgvFfhw3MBoxmv5LtfH',
      currency: 'USD',
      value: '-100'
    }
  ],
  bGpeQzUWFu4fMhJHZ1Via5aqFC3A5twZUD: [
    {
      counterparty: 'b4nmQNH4Fhjfh6cHDrvVSsBv7KySrj4cBf',
      currency: 'USD',
      value: '100'
    },
    {
      counterparty: 'bnYDWQaRdMr5neCGgvFfhw3MBoxmv5LtfH',
      currency: 'USD',
      value: '-100'
    }
  ],
  bnYDWQaRdMr5neCGgvFfhw3MBoxmv5LtfH: [
    {
      counterparty: 'bJsaPnGdeo7BhMnHjuc3n44Mf7Ra1qkSVJ',
      currency: 'USD',
      value: '100'
    },
    {
      counterparty: 'bbnsYgWn13Z28GtRgznbSUsLfMkvsXCZSu',
      currency: 'USD',
      value: '100'
    },
    {
      counterparty: 'bGpeQzUWFu4fMhJHZ1Via5aqFC3A5twZUD',
      currency: 'USD',
      value: '100'
    }
  ]
}

// Set trust limit to zero on rLDY when it has a balance of 0.02 USD
var removeTrustBalanceChanges = setTrustlineBalanceChanges


function loadFixture(filename) {
  var path = __dirname + '/fixtures/' + filename
  return JSON.parse(fs.readFileSync(path))
}

describe('parseBalanceChanges', function() {
  it('BMC create account', function() {
    var paymentResponse = loadFixture('payment-bmc-create-account.json')
    var result = parseBalanceChanges(paymentResponse.metadata)
    assert.deepEqual(result, createAccountBalanceChanges)
  })
  it('USD payment to account with no USD', function() {
    var filename = 'payment-iou-destination-no-balance.json'
    var paymentResponse = loadFixture(filename)
    var result = parseBalanceChanges(paymentResponse.metadata)
    assert.deepEqual(result, usdFirstPaymentBalanceChanges)
  })
  it('USD payment of all USD in source account', function() {
    var paymentResponse = loadFixture('payment-iou-spend-full-balance.json')
    var result = parseBalanceChanges(paymentResponse.metadata)
    assert.deepEqual(result, usdFullPaymentBalanceChanges)
  })
  it('USD payment to account with USD', function() {
    var paymentResponse = loadFixture('payment-iou.json')
    var result = parseBalanceChanges(paymentResponse.metadata)
    assert.deepEqual(result, usdPaymentBalanceChanges)
  })
  it('Set trust limit to 0 with balance remaining', function() {
    var paymentResponse = loadFixture('trustline-set-limit-to-zero.json')
    var result = parseBalanceChanges(paymentResponse.metadata)
    assert.deepEqual(result, removeTrustBalanceChanges)
  })
  it('Create trustline', function() {
    var paymentResponse = loadFixture('trustline-create.json')
    var result = parseBalanceChanges(paymentResponse.metadata)
    assert.deepEqual(result, createTrustlineBalanceChanges)
  })
  it('Set trustline', function() {
    var paymentResponse = loadFixture('trustline-set-limit.json')
    var result = parseBalanceChanges(paymentResponse.metadata)
    assert.deepEqual(result, setTrustlineBalanceChanges)
  })
  it('Set trustline 2', function() {
    var paymentResponse = loadFixture('trustline-set-limit-2.json')
    var result = parseBalanceChanges(paymentResponse.metadata)
    assert.deepEqual(result, setTrustlineBalanceChanges2)
  })
  it('Delete trustline', function() {
    var paymentResponse = loadFixture('trustline-delete.json')
    var result = parseBalanceChanges(paymentResponse.metadata)
    assert.deepEqual(result, deleteTrustlineBalanceChanges)
  })
  it('Redeem USD', function() {
    var paymentResponse = loadFixture('payment-iou-redeem.json')
    var result = parseBalanceChanges(paymentResponse.result.meta)
    assert.deepEqual(result, redeemBalanceChanges)
  })
  it('Redeem then issue USD', function() {
    var paymentResponse = loadFixture('payment-iou-redeem-then-issue.json')
    var result = parseBalanceChanges(paymentResponse.result.meta)
    assert.deepEqual(result, redeemThenIssueBalanceChanges)
  })
  it('Multipath USD payment', function() {
    var paymentResponse = loadFixture('payment-iou-multipath.json')
    var result = parseBalanceChanges(paymentResponse.result.meta)
    assert.deepEqual(result, multipathBalanceChanges)
  })
})

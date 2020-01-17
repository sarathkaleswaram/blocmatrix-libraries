'use strict'

var assert = require('assert-diff')
var fs = require('fs')
var parseFinalBalances = require('../src/index').parseFinalBalances

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
      value: '339.903994',
      currency: 'BMC',
      counterparty: ''
    }
  ]
}

// Pay 0.01 USD from rKmB to rLDY where rLDY starts with no USD
var usdFirstPaymentBalanceChanges = {
  bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc: [
    {
      value: '1.535330905250352',
      currency: 'USD',
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
    },
    {
      value: '239.807992',
      currency: 'BMC',
      counterparty: ''
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      counterparty: 'bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc',
      currency: 'USD',
      value: '-1.535330905250352'
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
      value: '1.545330905250352',
      currency: 'USD',
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      counterparty: 'bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc',
      currency: 'USD',
      value: '-1.545330905250352'
    },
    {
      counterparty: 'bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K',
      currency: 'USD',
      value: '0'
    }
  ],
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      value: '0',
      currency: 'USD',
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
    },
    {
      value: '99.976002',
      currency: 'BMC',
      counterparty: ''
    }
  ]
}

// Pay 0.01 USD from rKmB to rLDY where rLDY starts with 0.01 USD
var usdPaymentBalanceChanges = {
  bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc: [
    {
      value: '1.525330905250352',
      currency: 'USD',
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q'
    },
    {
      value: '239.555992',
      currency: 'BMC',
      counterparty: ''
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      counterparty: 'bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc',
      currency: 'USD',
      value: '-1.525330905250352'
    },
    {
      counterparty: 'bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K',
      currency: 'USD',
      value: '-0.02'
    }
  ],
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      currency: 'USD',
      value: '0.02'
    }
  ]
}

// Set trust limit to 200 USD on rLDY when it has a trust limit of 100 USD
// and has a balance of 0.02 USD
var setTrustlineBalanceChanges = {
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      currency: 'USD',
      value: '0.02'
    },
    {
      value: '99.940002',
      currency: 'BMC',
      counterparty: ''
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      counterparty: 'bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K',
      currency: 'USD',
      value: '-0.02'
    }
  ]
}

var setTrustlineBalanceChanges3 = {
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      currency: 'USD',
      value: '0.02'
    },
    {
      counterparty: '',
      currency: 'BMC',
      value: '99.884302'
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      counterparty: 'bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K',
      currency: 'USD',
      value: '-0.02'
    }
  ]
}

var setTrustlineBalanceChanges2 = {
  bsApBGKJmMfExxZBbGnzxEXyq7TMhMRg4e: [
    {
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      currency: 'USD',
      value: '0'
    },
    {
      counterparty: '',
      currency: 'BMC',
      value: '9248.902096'
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      counterparty: 'bsApBGKJmMfExxZBbGnzxEXyq7TMhMRg4e',
      currency: 'USD',
      value: '0'
    },
    {
      counterparty: '',
      currency: 'BMC',
      value: '149.99998'
    }
  ]
}

// Set trust limit to 100 USD with balance of 10 USD on rLDY
// when it has no trustline
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
      value: '99.740302'
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
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      currency: 'USD',
      value: '1.545330905250352'
    }
  ],
  bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q: [
    {
      counterparty: 'bKmBGxocj9Argy25J51Mk1iqFzW9aVF9Tc',
      currency: 'USD',
      value: '-1.545330905250352'
    },
    {
      counterparty: 'bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K',
      currency: 'USD',
      value: '0'
    }
  ],
  bLDYbujdKUfVx28T9vRDAryJ7G2WVXKo4K: [
    {
      counterparty: 'bMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
      currency: 'USD',
      value: '0'
    },
    {
      counterparty: '',
      currency: 'BMC',
      value: '99.752302'
    }
  ]
}

var redeemBalanceChanges = {
  bHr9CJAWyB4bj91VRWn96DkukG4rwdtyTh: [
    {
      counterparty: 'bPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK',
      currency: 'USD',
      value: '-100'
    }
  ],
  bPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK: [
    {
      counterparty: 'bHr9CJAWyB4bj91VRWn96DkukG4rwdtyTh',
      currency: 'USD',
      value: '100'
    },
    {
      counterparty: '',
      currency: 'BMC',
      value: '999.99998'
    }
  ]
}

var redeemThenIssueBalanceChanges = {
  bHr9CJAWyB4bj91VRWn96DkukG4rwdtyTh: [
    {
      counterparty: 'bPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK',
      currency: 'USD',
      value: '100'
    }
  ],
  bPMh7Pi9ct699iZUTWaytJUoHcJ7cgyziK: [
    {
      counterparty: 'bHr9CJAWyB4bj91VRWn96DkukG4rwdtyTh',
      currency: 'USD',
      value: '-100'
    },
    {
      counterparty: '',
      currency: 'BMC',
      value: '999.99997'
    }
  ]
}

var multipathBalanceChanges = {
  bbnsYgWn13Z28GtRgznbSUsLfMkvsXCZSu: [
    {
      counterparty: 'b4nmQNH4Fhjfh6cHDrvVSsBv7KySrj4cBf',
      currency: 'USD',
      value: '0'
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
      value: '0'
    },
    {
      counterparty: '',
      currency: 'BMC',
      value: '999.99999'
    },
    {
      counterparty: 'bJsaPnGdeo7BhMnHjuc3n44Mf7Ra1qkSVJ',
      currency: 'USD',
      value: '0'
    },
    {
      counterparty: 'bGpeQzUWFu4fMhJHZ1Via5aqFC3A5twZUD',
      currency: 'USD',
      value: '0'
    }
  ],
  bJsaPnGdeo7BhMnHjuc3n44Mf7Ra1qkSVJ: [
    {
      counterparty: 'b4nmQNH4Fhjfh6cHDrvVSsBv7KySrj4cBf',
      currency: 'USD',
      value: '0'
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
      value: '0'
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


function loadFixture(filename) {
  var path = __dirname + '/fixtures/' + filename
  return JSON.parse(fs.readFileSync(path))
}

describe('parseFinalBalances', function() {
  it('BMC create account', function() {
    var paymentResponse = loadFixture('payment-bmc-create-account.json')
    var result = parseFinalBalances(paymentResponse.metadata)
    assert.deepEqual(result, createAccountBalanceChanges)
  })
  it('USD payment to account with no USD', function() {
    var filename = 'payment-iou-destination-no-balance.json'
    var paymentResponse = loadFixture(filename)
    var result = parseFinalBalances(paymentResponse.metadata)
    assert.deepEqual(result, usdFirstPaymentBalanceChanges)
  })
  it('USD payment of all USD in source account', function() {
    var paymentResponse = loadFixture('payment-iou-spend-full-balance.json')
    var result = parseFinalBalances(paymentResponse.metadata)
    assert.deepEqual(result, usdFullPaymentBalanceChanges)
  })
  it('USD payment to account with USD', function() {
    var paymentResponse = loadFixture('payment-iou.json')
    var result = parseFinalBalances(paymentResponse.metadata)
    assert.deepEqual(result, usdPaymentBalanceChanges)
  })
  it('Set trust limit to 0 with balance remaining', function() {
    var paymentResponse = loadFixture('trustline-set-limit-to-zero.json')
    var result = parseFinalBalances(paymentResponse.metadata)
    assert.deepEqual(result, setTrustlineBalanceChanges)
  })
  it('Create trustline', function() {
    var paymentResponse = loadFixture('trustline-create.json')
    var result = parseFinalBalances(paymentResponse.metadata)
    assert.deepEqual(result, createTrustlineBalanceChanges)
  })
  it('Set trustline', function() {
    var paymentResponse = loadFixture('trustline-set-limit.json')
    var result = parseFinalBalances(paymentResponse.metadata)
    assert.deepEqual(result, setTrustlineBalanceChanges3)
  })
  it('Set trustline 2', function() {
    var paymentResponse = loadFixture('trustline-set-limit-2.json')
    var result = parseFinalBalances(paymentResponse.metadata)
    assert.deepEqual(result, setTrustlineBalanceChanges2)
  })
  it('Delete trustline', function() {
    var paymentResponse = loadFixture('trustline-delete.json')
    var result = parseFinalBalances(paymentResponse.metadata)
    assert.deepEqual(result, deleteTrustlineBalanceChanges)
  })
  it('Redeem USD', function() {
    var paymentResponse = loadFixture('payment-iou-redeem.json')
    var result = parseFinalBalances(paymentResponse.result.meta)
    assert.deepEqual(result, redeemBalanceChanges)
  })
  it('Redeem then issue USD', function() {
    var paymentResponse = loadFixture('payment-iou-redeem-then-issue.json')
    var result = parseFinalBalances(paymentResponse.result.meta)
    assert.deepEqual(result, redeemThenIssueBalanceChanges)
  })
  it('Multipath USD payment', function() {
    var paymentResponse = loadFixture('payment-iou-multipath.json')
    var result = parseFinalBalances(paymentResponse.result.meta)
    assert.deepEqual(result, multipathBalanceChanges)
  })
})

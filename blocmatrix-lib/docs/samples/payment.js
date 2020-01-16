'use strict';
const BlocmatrixAPI = require('../../dist/npm').BlocmatrixAPI;

const address = 'bHr9CJAWyB4bj91VRWn96DkukG4rwdtyTh';
const secret = 'snoPBbXtMeMyMHUVTgruqAfg1SUTr';

const api = new BlocmatrixAPI({server: 'ws://15.206.171.170:6006'});
const instructions = {maxLedgerVersionOffset: 5};

const payment = {
  source: {
    address: address,
    maxAmount: {
      value: '0.01',
      currency: 'BMC'
    }
  },
  destination: {
    address: 'bPhGXpxpCm3nXZw2Gg4kqJ8wM3VkR2wYY',
    amount: {
      value: '100',
      currency: 'BMC'
    }
  }
};

function quit(message) {
  console.log(message);
  process.exit(0);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

api.connect().then(() => {
  console.log('Connected...');
  return api.preparePayment(address, payment, instructions).then(prepared => {
    console.log('Payment transaction prepared...');
    const {signedTransaction} = api.sign(prepared.txJSON, secret);
    console.log('Payment transaction signed...');
    api.submit(signedTransaction).then(quit, fail);
  });
}).catch(fail);

'use strict';
const BlocmatrixAPI = require('../../dist/npm').BlocmatrixAPI;

const address = 'bPhGXpxpCm3nXZw2Gg4kqJ8wM3VkR2wYY';
const secret = '';

const api = new BlocmatrixAPI({ server: 'ws://15.206.171.170:6006' });
const instructions = { maxLedgerVersionOffset: 5 };

function fail(message) {
  console.error(message);
  process.exit(1);
}

function cancelOrder(orderSequence) {
  console.log('Cancelling order: ' + orderSequence.toString());
  return api.prepareOrderCancellation(address, { orderSequence }, instructions)
    .then(prepared => {
      const signing = api.sign(prepared.txJSON, secret);
      return api.submit(signing.signedTransaction);
    });
}

function cancelAllOrders(orderSequences) {
  if (orderSequences.length === 0) {
    return Promise.resolve();
  }
  const orderSequence = orderSequences.pop();
  return cancelOrder(orderSequence).then(() => cancelAllOrders(orderSequences));
}

api.connect().then(() => {
  console.log('Connected...');
  return api.getOrders(address).then(orders => {
    const orderSequences = orders.map(order => order.properties.sequence);
    return cancelAllOrders(orderSequences);
  }).then(() => process.exit(0));
}).catch(fail);

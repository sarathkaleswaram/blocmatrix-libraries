'use strict';
const BlocmatrixAPI = require('../../dist/npm').BlocmatrixAPI;

const api = new BlocmatrixAPI({ server: 'ws://15.206.171.170:6006' });
const address = 'bPhGXpxpCm3nXZw2Gg4kqJ8wM3VkR2wYY';

api.connect().then(() => {
  api.getBalances(address).then(balances => {
    console.log(JSON.stringify(balances, null, 2));
    process.exit();
  });
});

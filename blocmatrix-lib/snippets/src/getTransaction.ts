import {BlocmatrixAPI} from '../../dist/npm'

const api = new BlocmatrixAPI({
  server: 'ws://183.82.116.216:6006'
})

getTransaction()

async function getTransaction() {
  await api.connect()
  const ledger = await api.getLedger({includeTransactions: true})
  console.log(ledger)
  const tx = await api.getTransaction(ledger.transactionHashes[0])
  console.log(tx)
  console.log('deliveredAmount:', tx.outcome.deliveredAmount)
  process.exit(0)
}

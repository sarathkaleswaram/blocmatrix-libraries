import {BlocmatrixAPI} from '../../dist/npm'

const api = new BlocmatrixAPI({server: 'ws://183.82.116.216:6006'})

parseAccountFlags()

async function parseAccountFlags() {
  await api.connect()
  const account_info = await api.request('account_info', {account: 'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM'})
  const flags = api.parseAccountFlags(account_info.account_data.Flags)
  console.log(JSON.stringify(flags, null, 2))
  process.exit(0)
}

import {BlocmatrixAPIBroadcast} from '../../src'

function main() {
  const servers = ['wss://s1.blocmatrix.com', 'wss://s2.blocmatrix.com']
  const api = new BlocmatrixAPIBroadcast(servers)
  api.connect().then(() => {
    api.getServerInfo().then(info => {
      console.log(JSON.stringify(info, null, 2))
    })
    api.on('ledger', ledger => {
      console.log(JSON.stringify(ledger, null, 2))
    })
  })
}

main()

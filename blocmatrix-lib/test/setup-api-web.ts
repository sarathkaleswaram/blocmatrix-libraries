import {BlocmatrixAPI, BlocmatrixAPIBroadcast} from 'blocmatrix-api'
import ledgerClosed from './fixtures/blocmatrixd/ledger-close.json'

const port = 34371
const baseUrl = 'ws://testblocmatrix.circleci.com:'

function setup(this: any, port_ = port) {
  const tapi = new BlocmatrixAPI({server: baseUrl + port_})
  return tapi
    .connect()
    .then(() => {
      return tapi.connection.request({
        command: 'test_command',
        data: {openOnOtherPort: true}
      })
    })
    .then(got => {
      return new Promise((resolve, reject) => {
        this.api = new BlocmatrixAPI({server: baseUrl + got.port})
        this.api
          .connect()
          .then(() => {
            this.api.once('ledger', () => resolve())
            this.api.connection._ws.emit(
              'message',
              JSON.stringify(ledgerClosed)
            )
          })
          .catch(reject)
      })
    })
    .then(() => {
      return tapi.disconnect()
    })
}

function setupBroadcast(this: any) {
  const servers = [port, port + 1].map(port_ => baseUrl + port_)
  this.api = new BlocmatrixAPIBroadcast(servers)
  return new Promise((resolve, reject) => {
    this.api
      .connect()
      .then(() => {
        this.api.once('ledger', () => resolve())
        this.api._apis[0].connection._ws.emit(
          'message',
          JSON.stringify(ledgerClosed)
        )
      })
      .catch(reject)
  })
}

function teardown(this: any) {
  if (this.api.isConnected()) {
    return this.api.disconnect()
  }
  return undefined
}

export default {
  setup: setup,
  teardown: teardown,
  setupBroadcast: setupBroadcast
}

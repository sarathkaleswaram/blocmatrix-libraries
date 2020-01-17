import {BlocmatrixAPI, BlocmatrixAPIBroadcast} from 'blocmatrix-api'
import ledgerClosed from './fixtures/blocmatrixd/ledger-close.json'
import {createMockBlocmatrixd} from './mock-blocmatrixd'
import {getFreePort} from './utils'

function setupMockBlocmatrixdConnection(testcase, port) {
  return new Promise((resolve, reject) => {
    testcase.mockBlocmatrixd = createMockBlocmatrixd(port)
    testcase._mockedServerPort = port
    testcase.api = new BlocmatrixAPI({server: 'ws://localhost:' + port})
    testcase.api
      .connect()
      .then(() => {
        testcase.api.once('ledger', () => resolve())
        testcase.api.connection._ws.emit(
          'message',
          JSON.stringify(ledgerClosed)
        )
      })
      .catch(reject)
  })
}

function setupMockBlocmatrixdConnectionForBroadcast(testcase, ports) {
  return new Promise((resolve, reject) => {
    const servers = ports.map(port => 'ws://localhost:' + port)
    testcase.mocks = ports.map(port => createMockBlocmatrixd(port))
    testcase.api = new BlocmatrixAPIBroadcast(servers)
    testcase.api
      .connect()
      .then(() => {
        testcase.api.once('ledger', () => resolve())
        testcase.mocks[0].socket.send(JSON.stringify(ledgerClosed))
      })
      .catch(reject)
  })
}

function setup(this: any) {
  return getFreePort().then(port => {
    return setupMockBlocmatrixdConnection(this, port)
  })
}

function setupBroadcast(this: any) {
  return Promise.all([getFreePort(), getFreePort()]).then(ports => {
    return setupMockBlocmatrixdConnectionForBroadcast(this, ports)
  })
}

function teardown(this: any, done) {
  this.api
    .disconnect()
    .then(() => {
      if (this.mockBlocmatrixd !== undefined) {
        this.mockBlocmatrixd.close()
      } else {
        this.mocks.forEach(mock => mock.close())
      }
      setImmediate(done)
    })
    .catch(done)
}

export default {
  setup: setup,
  teardown: teardown,
  setupBroadcast: setupBroadcast,
  createMockBlocmatrixd: createMockBlocmatrixd
}

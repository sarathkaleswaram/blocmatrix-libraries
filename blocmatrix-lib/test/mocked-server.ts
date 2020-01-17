const port = 34371
import {createMockBlocmatrixd} from './mock-blocmatrixd'

function main() {
  if (global.describe) {
    // we are running inside mocha, exiting
    return
  }
  console.log('starting server on port ' + port)
  createMockBlocmatrixd(port)
  console.log('starting server on port ' + String(port + 1))
  createMockBlocmatrixd(port + 1)
}

main()

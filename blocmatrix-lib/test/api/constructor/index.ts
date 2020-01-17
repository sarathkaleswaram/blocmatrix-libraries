import assert from 'assert-diff'
import {TestSuite} from '../../utils'
import {BlocmatrixAPI} from 'blocmatrix-api'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'BlocmatrixAPI - implicit server port': () => {
    new BlocmatrixAPI({server: 'wss://s1.blocmatrix.com'})
  },

  'BlocmatrixAPI invalid options': () => {
    // @ts-ignore - This is intentionally invalid
    assert.throws(() => new BlocmatrixAPI({invalid: true}))
  },

  'BlocmatrixAPI valid options': () => {
    const api = new BlocmatrixAPI({server: 'wss://s:1'})
    const privateConnectionUrl = (api.connection as any)._url
    assert.deepEqual(privateConnectionUrl, 'wss://s:1')
  },

  'BlocmatrixAPI invalid server uri': () => {
    assert.throws(() => new BlocmatrixAPI({server: 'wss//s:1'}))
  }
}

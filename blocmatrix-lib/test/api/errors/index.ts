import assert from 'assert-diff'
import {TestSuite} from '../../utils'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'RippleError with data': async (api, address) => {
    const error = new api.errors.RippleError('_message_', '_data_')
    assert.strictEqual(error.toString(), "[RippleError(_message_, '_data_')]")
  },

  'NotFoundError default message': async (api, address) => {
    const error = new api.errors.NotFoundError()
    assert.strictEqual(error.toString(), '[NotFoundError(Not found)]')
  }
}

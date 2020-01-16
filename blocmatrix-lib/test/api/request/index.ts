import responses from '../../fixtures/responses'
import {assertResultMatch, TestSuite} from '../../utils'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'request account_objects': async (api, address) => {
    const result = await api.request('account_objects', {
      account: address
    })

    assertResultMatch(
      result,
      responses.getAccountObjects,
      'AccountObjectsResponse'
    )
  },

  'request account_objects - invalid options': async (api, address) => {
    // Intentionally no local validation of these options
    const result = await api.request('account_objects', {
      account: address,
      invalid: 'options'
    })

    assertResultMatch(
      result,
      responses.getAccountObjects,
      'AccountObjectsResponse'
    )
  }
}

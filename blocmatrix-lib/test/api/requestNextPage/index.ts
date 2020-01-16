import assert from 'assert-diff'
import {LedgerData} from 'ripple-api/common/types/objects'
import {assertRejects, TestSuite} from '../../utils'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'requests the next page': async (api, address) => {
    const response = await api.request('ledger_data')
    const responseNextPage = await api.requestNextPage<LedgerData>(
      'ledger_data',
      {},
      response
    )
    assert.equal(
      responseNextPage.state[0].index,
      '000B714B790C3C79FEE00D17C4DEB436B375466F29679447BA64F265FD63D731'
    )
  },

  'rejects when there are no more pages': async (api, address) => {
    const response = await api.request('ledger_data')
    const responseNextPage = await api.requestNextPage(
      'ledger_data',
      {},
      response
    )
    assert(!api.hasNextPage(responseNextPage))
    await assertRejects(
      api.requestNextPage('ledger_data', {}, responseNextPage),
      Error,
      'response does not have a next page'
    )
  }
}

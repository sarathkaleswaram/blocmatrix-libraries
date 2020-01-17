import assert from 'assert-diff'
import {TestSuite} from '../../utils'
import BigNumber from 'bignumber.js'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'works with a typical amount': async api => {
    const bmc = api.dropsToBmc('2000000')
    assert.strictEqual(bmc, '2', '2 million drops equals 2 BMC')
  },
  'works with fractions': async api => {
    let bmc = api.dropsToBmc('3456789')
    assert.strictEqual(bmc, '3.456789', '3,456,789 drops equals 3.456789 BMC')

    bmc = api.dropsToBmc('3400000')
    assert.strictEqual(bmc, '3.4', '3,400,000 drops equals 3.4 BMC')

    bmc = api.dropsToBmc('1')
    assert.strictEqual(bmc, '0.000001', '1 drop equals 0.000001 BMC')

    bmc = api.dropsToBmc('1.0')
    assert.strictEqual(bmc, '0.000001', '1.0 drops equals 0.000001 BMC')

    bmc = api.dropsToBmc('1.00')
    assert.strictEqual(bmc, '0.000001', '1.00 drops equals 0.000001 BMC')
  },
  'works with zero': async api => {
    let bmc = api.dropsToBmc('0')
    assert.strictEqual(bmc, '0', '0 drops equals 0 BMC')

    // negative zero is equivalent to zero
    bmc = api.dropsToBmc('-0')
    assert.strictEqual(bmc, '0', '-0 drops equals 0 BMC')

    bmc = api.dropsToBmc('0.00')
    assert.strictEqual(bmc, '0', '0.00 drops equals 0 BMC')

    bmc = api.dropsToBmc('000000000')
    assert.strictEqual(bmc, '0', '000000000 drops equals 0 BMC')
  },
  'works with a negative value': async api => {
    const bmc = api.dropsToBmc('-2000000')
    assert.strictEqual(bmc, '-2', '-2 million drops equals -2 BMC')
  },
  'works with a value ending with a decimal point': async api => {
    let bmc = api.dropsToBmc('2000000.')
    assert.strictEqual(bmc, '2', '2000000. drops equals 2 BMC')

    bmc = api.dropsToBmc('-2000000.')
    assert.strictEqual(bmc, '-2', '-2000000. drops equals -2 BMC')
  },
  'works with BigNumber objects': async api => {
    let bmc = api.dropsToBmc(new BigNumber(2000000))
    assert.strictEqual(bmc, '2', '(BigNumber) 2 million drops equals 2 BMC')

    bmc = api.dropsToBmc(new BigNumber(-2000000))
    assert.strictEqual(bmc, '-2', '(BigNumber) -2 million drops equals -2 BMC')

    bmc = api.dropsToBmc(new BigNumber(2345678))
    assert.strictEqual(
      bmc,
      '2.345678',
      '(BigNumber) 2,345,678 drops equals 2.345678 BMC'
    )

    bmc = api.dropsToBmc(new BigNumber(-2345678))
    assert.strictEqual(
      bmc,
      '-2.345678',
      '(BigNumber) -2,345,678 drops equals -2.345678 BMC'
    )
  },
  'works with a number': async api => {
    // This is not recommended. Use strings or BigNumber objects to avoid precision errors.
    let bmc = api.dropsToBmc(2000000)
    assert.strictEqual(bmc, '2', '(number) 2 million drops equals 2 BMC')
    bmc = api.dropsToBmc(-2000000)
    assert.strictEqual(bmc, '-2', '(number) -2 million drops equals -2 BMC')
  },
  'throws with an amount with too many decimal places': async api => {
    assert.throws(() => {
      api.dropsToBmc('1.2')
    }, /has too many decimal places/)

    assert.throws(() => {
      api.dropsToBmc('0.10')
    }, /has too many decimal places/)
  },
  'throws with an invalid value': async api => {
    assert.throws(() => {
      api.dropsToBmc('FOO')
    }, /invalid value/)

    assert.throws(() => {
      api.dropsToBmc('1e-7')
    }, /invalid value/)

    assert.throws(() => {
      api.dropsToBmc('2,0')
    }, /invalid value/)

    assert.throws(() => {
      api.dropsToBmc('.')
    }, /dropsToBmc: invalid value '\.', should be a BigNumber or string-encoded number\./)
  },
  'throws with an amount more than one decimal point': async api => {
    assert.throws(() => {
      api.dropsToBmc('1.0.0')
    }, /dropsToBmc: invalid value '1\.0\.0'/)

    assert.throws(() => {
      api.dropsToBmc('...')
    }, /dropsToBmc: invalid value '\.\.\.'/)
  }
}

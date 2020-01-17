import assert from 'assert-diff'
import BigNumber from 'bignumber.js'
import {TestSuite} from '../../utils'

/**
 * Every test suite exports their tests in the default object.
 * - Check out the "TestSuite" type for documentation on the interface.
 * - Check out "test/api/index.ts" for more information about the test runner.
 */
export default <TestSuite>{
  'works with a typical amount': function(api) {
    const drops = api.bmcToDrops('2')
    assert.strictEqual(drops, '2000000', '2 BMC equals 2 million drops')
  },
  'works with fractions': function(api) {
    let drops = api.bmcToDrops('3.456789')
    assert.strictEqual(drops, '3456789', '3.456789 BMC equals 3,456,789 drops')
    drops = api.bmcToDrops('3.400000')
    assert.strictEqual(drops, '3400000', '3.400000 BMC equals 3,400,000 drops')
    drops = api.bmcToDrops('0.000001')
    assert.strictEqual(drops, '1', '0.000001 BMC equals 1 drop')
    drops = api.bmcToDrops('0.0000010')
    assert.strictEqual(drops, '1', '0.0000010 BMC equals 1 drop')
  },
  'works with zero': function(api) {
    let drops = api.bmcToDrops('0')
    assert.strictEqual(drops, '0', '0 BMC equals 0 drops')
    drops = api.bmcToDrops('-0') // negative zero is equivalent to zero
    assert.strictEqual(drops, '0', '-0 BMC equals 0 drops')
    drops = api.bmcToDrops('0.000000')
    assert.strictEqual(drops, '0', '0.000000 BMC equals 0 drops')
    drops = api.bmcToDrops('0.0000000')
    assert.strictEqual(drops, '0', '0.0000000 BMC equals 0 drops')
  },
  'works with a negative value': function(api) {
    const drops = api.bmcToDrops('-2')
    assert.strictEqual(drops, '-2000000', '-2 BMC equals -2 million drops')
  },
  'works with a value ending with a decimal point': function(api) {
    let drops = api.bmcToDrops('2.')
    assert.strictEqual(drops, '2000000', '2. BMC equals 2000000 drops')
    drops = api.bmcToDrops('-2.')
    assert.strictEqual(drops, '-2000000', '-2. BMC equals -2000000 drops')
  },
  'works with BigNumber objects': function(api) {
    let drops = api.bmcToDrops(new BigNumber(2))
    assert.strictEqual(
      drops,
      '2000000',
      '(BigNumber) 2 BMC equals 2 million drops'
    )
    drops = api.bmcToDrops(new BigNumber(-2))
    assert.strictEqual(
      drops,
      '-2000000',
      '(BigNumber) -2 BMC equals -2 million drops'
    )
  },
  'works with a number': function(api) {
    // This is not recommended. Use strings or BigNumber objects to avoid precision errors.
    let drops = api.bmcToDrops(2)
    assert.strictEqual(
      drops,
      '2000000',
      '(number) 2 BMC equals 2 million drops'
    )
    drops = api.bmcToDrops(-2)
    assert.strictEqual(
      drops,
      '-2000000',
      '(number) -2 BMC equals -2 million drops'
    )
  },
  'throws with an amount with too many decimal places': function(api) {
    assert.throws(() => {
      api.bmcToDrops('1.1234567')
    }, /has too many decimal places/)
    assert.throws(() => {
      api.bmcToDrops('0.0000001')
    }, /has too many decimal places/)
  },
  'throws with an invalid value': function(api) {
    assert.throws(() => {
      api.bmcToDrops('FOO')
    }, /invalid value/)
    assert.throws(() => {
      api.bmcToDrops('1e-7')
    }, /invalid value/)
    assert.throws(() => {
      api.bmcToDrops('2,0')
    }, /invalid value/)
    assert.throws(() => {
      api.bmcToDrops('.')
    }, /bmcToDrops: invalid value '\.', should be a BigNumber or string-encoded number\./)
  },
  'throws with an amount more than one decimal point': function(api) {
    assert.throws(() => {
      api.bmcToDrops('1.0.0')
    }, /bmcToDrops: invalid value '1\.0\.0'/)
    assert.throws(() => {
      api.bmcToDrops('...')
    }, /bmcToDrops: invalid value '\.\.\.'/)
  }
}

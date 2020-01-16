import * as _ from 'lodash'
import BigNumber from 'bignumber.js'
import {deriveKeypair} from 'blocmatrix-keypairs'
import {Amount, BlocmatrixdAmount} from './types/objects'
import {ValidationError} from './errors'

function isValidSecret(secret: string): boolean {
  try {
    deriveKeypair(secret)
    return true
  } catch (err) {
    return false
  }
}

function dropsToBmc(drops: BigNumber.Value): string {
  if (typeof drops === 'string') {
    if (!drops.match(/^-?[0-9]*\.?[0-9]*$/)) {
      throw new ValidationError(
        `dropsToBmc: invalid value '${drops}',` +
          ` should be a number matching (^-?[0-9]*\\.?[0-9]*$).`
      )
    } else if (drops === '.') {
      throw new ValidationError(
        `dropsToBmc: invalid value '${drops}',` +
          ` should be a BigNumber or string-encoded number.`
      )
    }
  }

  // Converting to BigNumber and then back to string should remove any
  // decimal point followed by zeros, e.g. '1.00'.
  // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
  drops = new BigNumber(drops).toString(10)

  // drops are only whole units
  if (drops.includes('.')) {
    throw new ValidationError(
      `dropsToBmc: value '${drops}' has` + ` too many decimal places.`
    )
  }

  // This should never happen; the value has already been
  // validated above. This just ensures BigNumber did not do
  // something unexpected.
  if (!drops.match(/^-?[0-9]+$/)) {
    throw new ValidationError(
      `dropsToBmc: failed sanity check -` +
        ` value '${drops}',` +
        ` does not match (^-?[0-9]+$).`
    )
  }

  return new BigNumber(drops).dividedBy(1000000.0).toString(10)
}

function bmcToDrops(bmc: BigNumber.Value): string {
  if (typeof bmc === 'string') {
    if (!bmc.match(/^-?[0-9]*\.?[0-9]*$/)) {
      throw new ValidationError(
        `bmcToDrops: invalid value '${bmc}',` +
          ` should be a number matching (^-?[0-9]*\\.?[0-9]*$).`
      )
    } else if (bmc === '.') {
      throw new ValidationError(
        `bmcToDrops: invalid value '${bmc}',` +
          ` should be a BigNumber or string-encoded number.`
      )
    }
  }

  // Important: specify base 10 to avoid exponential notation, e.g. '1e-7'.
  bmc = new BigNumber(bmc).toString(10)

  // This should never happen; the value has already been
  // validated above. This just ensures BigNumber did not do
  // something unexpected.
  if (!bmc.match(/^-?[0-9.]+$/)) {
    throw new ValidationError(
      `bmcToDrops: failed sanity check -` +
        ` value '${bmc}',` +
        ` does not match (^-?[0-9.]+$).`
    )
  }

  const components = bmc.split('.')
  if (components.length > 2) {
    throw new ValidationError(
      `bmcToDrops: failed sanity check -` +
        ` value '${bmc}' has` +
        ` too many decimal points.`
    )
  }

  const fraction = components[1] || '0'
  if (fraction.length > 6) {
    throw new ValidationError(
      `bmcToDrops: value '${bmc}' has` + ` too many decimal places.`
    )
  }

  return new BigNumber(bmc)
    .times(1000000.0)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toString(10)
}

function toBlocmatrixdAmount(amount: Amount): BlocmatrixdAmount {
  if (amount.currency === 'BMC') {
    return bmcToDrops(amount.value)
  }
  if (amount.currency === 'drops') {
    return amount.value
  }
  return {
    currency: amount.currency,
    issuer: amount.counterparty
      ? amount.counterparty
      : amount.issuer
      ? amount.issuer
      : undefined,
    value: amount.value
  }
}

function convertKeysFromSnakeCaseToCamelCase(obj: any): any {
  if (typeof obj === 'object') {
    const accumulator = Array.isArray(obj) ? [] : {}
    let newKey
    return _.reduce(
      obj,
      (result, value, key) => {
        newKey = key
        // taking this out of function leads to error in PhantomJS
        const FINDSNAKE = /([a-zA-Z]_[a-zA-Z])/g
        if (FINDSNAKE.test(key)) {
          newKey = key.replace(FINDSNAKE, r => r[0] + r[2].toUpperCase())
        }
        result[newKey] = convertKeysFromSnakeCaseToCamelCase(value)
        return result
      },
      accumulator
    )
  }
  return obj
}

function removeUndefined<T extends object>(obj: T): T {
  return _.omitBy(obj, _.isUndefined) as T
}

/**
 * @param {Number} rpepoch (seconds since 1/1/2000 GMT)
 * @return {Number} ms since unix epoch
 */
function blocmatrixToUnixTimestamp(rpepoch: number): number {
  return (rpepoch + 0x386d4380) * 1000
}

/**
 * @param {Number|Date} timestamp (ms since unix epoch)
 * @return {Number} seconds since blocmatrix epoch (1/1/2000 GMT)
 */
function unixToBlocmatrixTimestamp(timestamp: number): number {
  return Math.round(timestamp / 1000) - 0x386d4380
}

function blocmatrixTimeToISO8601(blocmatrixTime: number): string {
  return new Date(blocmatrixToUnixTimestamp(blocmatrixTime)).toISOString()
}

/**
 * @param {string} iso8601 international standard date format
 * @return {number} seconds since blocmatrix epoch (1/1/2000 GMT)
 */
function iso8601ToBlocmatrixTime(iso8601: string): number {
  return unixToBlocmatrixTimestamp(Date.parse(iso8601))
}

export {
  dropsToBmc,
  bmcToDrops,
  toBlocmatrixdAmount,
  convertKeysFromSnakeCaseToCamelCase,
  removeUndefined,
  blocmatrixTimeToISO8601,
  iso8601ToBlocmatrixTime,
  isValidSecret
}

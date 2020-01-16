import * as utils from './utils'
import {validate, ensureClassicAddress} from '../common'
import {Connection} from '../common'
import {GetTrustlinesOptions} from './trustlines'
import {FormattedTrustline} from '../common/types/objects/trustlines'
import {BlocmatrixAPI} from '..'

export type Balance = {
  value: string
  currency: string
  counterparty?: string
}

export type GetBalances = Array<Balance>

function getTrustlineBalanceAmount(trustline: FormattedTrustline) {
  return {
    currency: trustline.specification.currency,
    counterparty: trustline.specification.counterparty,
    value: trustline.state.balance
  }
}

function formatBalances(options, balances) {
  const result = balances.trustlines.map(getTrustlineBalanceAmount)
  if (
    !(options.counterparty || (options.currency && options.currency !== 'BMC'))
  ) {
    const bmcBalance = {
      currency: 'BMC',
      value: balances.bmc
    }
    result.unshift(bmcBalance)
  }
  if (options.limit && result.length > options.limit) {
    const toRemove = result.length - options.limit
    result.splice(-toRemove, toRemove)
  }
  return result
}

function getLedgerVersionHelper(
  connection: Connection,
  optionValue?: number
): Promise<number> {
  if (optionValue !== undefined && optionValue !== null) {
    return Promise.resolve(optionValue)
  }
  return connection.getLedgerVersion()
}

function getBalances(
  this: BlocmatrixAPI,
  address: string,
  options: GetTrustlinesOptions = {}
): Promise<GetBalances> {
  validate.getTrustlines({address, options})

  // Only support retrieving balances without a tag,
  // since we currently do not calculate balances
  // on a per-tag basis. Apps must interpret and
  // use tags independent of the BMC Ledger, comparing
  // with the BMC Ledger's balance as an accounting check.
  address = ensureClassicAddress(address)

  return Promise.all([
    getLedgerVersionHelper(
      this.connection,
      options.ledgerVersion
    ).then(ledgerVersion =>
      utils.getBMCBalance(this.connection, address, ledgerVersion)
    ),
    this.getTrustlines(address, options)
  ]).then(results =>
    formatBalances(options, {bmc: results[0], trustlines: results[1]})
  )
}

export default getBalances

import * as common from '../common'
import {BlocmatrixAPI} from '..'

function isConnected(this: BlocmatrixAPI): boolean {
  return this.connection.isConnected()
}

function getLedgerVersion(this: BlocmatrixAPI): Promise<number> {
  return this.connection.getLedgerVersion()
}

function connect(this: BlocmatrixAPI): Promise<void> {
  return this.connection.connect()
}

function disconnect(this: BlocmatrixAPI): Promise<void> {
  return this.connection.disconnect()
}

function formatLedgerClose(ledgerClose: any): object {
  return {
    baseFeeBMC: common.dropsToBmc(ledgerClose.fee_base),
    ledgerHash: ledgerClose.ledger_hash,
    ledgerVersion: ledgerClose.ledger_index,
    ledgerTimestamp: common.blocmatrixTimeToISO8601(ledgerClose.ledger_time),
    reserveBaseBMC: common.dropsToBmc(ledgerClose.reserve_base),
    reserveIncrementBMC: common.dropsToBmc(ledgerClose.reserve_inc),
    transactionCount: ledgerClose.txn_count,
    validatedLedgerVersions: ledgerClose.validated_ledgers
  }
}

export {connect, disconnect, isConnected, getLedgerVersion, formatLedgerClose}

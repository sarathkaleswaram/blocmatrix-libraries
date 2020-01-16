import * as common from '../../common'
import {Amount, BlocmatrixdAmount} from '../../common/types/objects'

function parseAmount(amount: BlocmatrixdAmount): Amount {
  if (typeof amount === 'string') {
    return {
      currency: 'BMC',
      value: common.dropsToBmc(amount)
    }
  }
  return {
    currency: amount.currency,
    value: amount.value,
    counterparty: amount.issuer
  }
}

export default parseAmount

import * as utils from './utils'
const toBlocmatrixdAmount = utils.common.toBlocmatrixdAmount
import {validate, iso8601ToBlocmatrixTime} from '../common'
import {Instructions, Prepare, TransactionJSON} from './types'
import {Amount} from '../common/types/objects'
import {BlocmatrixAPI} from '..'

export type CheckCreateParameters = {
  destination: string
  sendMax: Amount
  destinationTag?: number
  expiration?: string
  invoiceID?: string
}

function createCheckCreateTransaction(
  account: string,
  check: CheckCreateParameters
): TransactionJSON {
  const txJSON: any = {
    Account: account,
    TransactionType: 'CheckCreate',
    Destination: check.destination,
    SendMax: toBlocmatrixdAmount(check.sendMax)
  }

  if (check.destinationTag !== undefined) {
    txJSON.DestinationTag = check.destinationTag
  }

  if (check.expiration !== undefined) {
    txJSON.Expiration = iso8601ToBlocmatrixTime(check.expiration)
  }

  if (check.invoiceID !== undefined) {
    txJSON.InvoiceID = check.invoiceID
  }

  return txJSON
}

function prepareCheckCreate(
  this: BlocmatrixAPI,
  address: string,
  checkCreate: CheckCreateParameters,
  instructions: Instructions = {}
): Promise<Prepare> {
  try {
    validate.prepareCheckCreate({address, checkCreate, instructions})
    const txJSON = createCheckCreateTransaction(address, checkCreate)
    return utils.prepareTransaction(txJSON, this, instructions)
  } catch (e) {
    return Promise.reject(e)
  }
}

export default prepareCheckCreate

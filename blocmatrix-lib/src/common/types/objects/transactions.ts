import {BlocmatrixdAmount} from './amounts'
import {Memo} from './memos'

export interface OfferCreateTransaction {
  TransactionType: 'OfferCreate'
  Account: string
  AccountTxnID?: string
  Fee: string
  Field: any
  Flags: number
  LastLedgerSequence?: number
  Sequence: number
  Signers: any[]
  SigningPubKey: string
  SourceTag?: number
  TakerGets: BlocmatrixdAmount
  TakerPays: BlocmatrixdAmount
  TxnSignature: string
  Expiration?: number
  Memos?: Memo[]
  OfferSequence?: number
}

import BigNumber from 'bignumber.js'
import {dropsToBmc} from '../../common'

function parseFeeUpdate(tx: any) {
  const baseFeeDrops = new BigNumber(tx.BaseFee, 16).toString()
  return {
    baseFeeBMC: dropsToBmc(baseFeeDrops),
    referenceFeeUnits: tx.ReferenceFeeUnits,
    reserveBaseBMC: dropsToBmc(tx.ReserveBase),
    reserveIncrementBMC: dropsToBmc(tx.ReserveIncrement)
  }
}

export default parseFeeUpdate

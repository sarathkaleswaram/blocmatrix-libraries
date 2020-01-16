import * as common from '../common'
import keypairs from 'blocmatrix-keypairs'
import binary from 'blocmatrix-binary-codec'
const {validate, bmcToDrops} = common

function signPaymentChannelClaim(
  channel: string,
  amount: string,
  privateKey: string
): string {
  validate.signPaymentChannelClaim({channel, amount, privateKey})

  const signingData = binary.encodeForSigningClaim({
    channel: channel,
    amount: bmcToDrops(amount)
  })
  return keypairs.sign(signingData, privateKey)
}

export default signPaymentChannelClaim

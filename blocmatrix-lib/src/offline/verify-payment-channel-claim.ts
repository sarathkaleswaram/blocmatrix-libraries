import keypairs from 'blocmatrix-keypairs'
import binary from 'blocmatrix-binary-codec'
import {validate, bmcToDrops} from '../common'

function verifyPaymentChannelClaim(
  channel: string,
  amount: string,
  signature: string,
  publicKey: string
): string {
  validate.verifyPaymentChannelClaim({channel, amount, signature, publicKey})

  const signingData = binary.encodeForSigningClaim({
    channel: channel,
    amount: bmcToDrops(amount)
  })
  return keypairs.verify(signingData, signature, publicKey)
}

export default verifyPaymentChannelClaim

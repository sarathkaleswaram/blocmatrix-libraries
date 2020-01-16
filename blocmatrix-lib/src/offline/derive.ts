import {deriveKeypair, deriveAddress} from 'blocmatrix-keypairs'
import {classicAddressToXAddress} from 'blocmatrix-address-codec'

function deriveXAddress(options: {
  publicKey: string
  tag: number | false
  test: boolean
}): string {
  const classicAddress = deriveAddress(options.publicKey)
  return classicAddressToXAddress(classicAddress, options.tag, options.test)
}

export {deriveKeypair, deriveAddress, deriveXAddress}

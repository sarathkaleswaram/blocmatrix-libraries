import {
  classicAddressToXAddress,
  xAddressToClassicAddress,
  isValidXAddress,
  encodeXAddress
} from './index'

const testCases = [
  [
    'bfSndjP5m82SjJxza43crgYPGvSDtBRS6t',
     0,
    'X7FWWtzh5V9HM86wj9ifb56d2gynvzGoZyaiBBpgKpQBcFu',
    'T7kpAb9s2S6JoJTmzx21u5TYh3VtSZvqX9hJ7iGUuCM3n9a'
  ],
  [
    'bfSndjP5m82SjJxza43crgYPGvSDtBRS6t',
    1,
    'X7FWWtzh5V9HM86wj9ifb56d2gynvzGFCTp1gaioYo4MeuW',
    'T7kpAb9s2S6JoJTmzx21u5TYh3VtSZvicczKy8aL94253eW'
  ],
  [
    'bfSndjP5m82SjJxza43crgYPGvSDtBRS6t',
    14,
    'X7FWWtzh5V9HM86wj9ifb56d2gynvzHht59DwweRdzuzWP4',
    'T7kpAb9s2S6JoJTmzx21u5TYh3VtSZAaqtaCTq1xNr9WqWt'
  ],
  [
    'bfSndjP5m82SjJxza43crgYPGvSDtBRS6t',
    11747,
    'X7FWWtzh5V9HM86wj9ifb56d2gynvzMaDSmwpt9py4Fhut1',
    'T7kpAb9s2S6JoJTmzx21u5TYh3VtS2b3wc5cLZ4ZZycxXqf'
  ],
  [
    'bfSndjP5m82SjJxza43crgYPGvSDtBRS6t',
    false,
    'X7FWWtzh5V9HM86wj9ifb56d2gynvzBy4geNV2cjV3kCgPg',
    'T7kpAb9s2S6JoJTmzx21u5TYh3VtSZibKirgoEiGnjQNzYx'
  ],
  [
    'bhfaQEExdFeP7nxPAJTrZ2Yisu8QHPA5E5',
    false,
    'X7dCCNyW3oxmstHg7eUQYCdtSopojGRsxPn7rgfZADwNV1Z',
    'T7ZUnM37zmW8VQhHkSABSCP8vNZcNinnuZpvuMMaXjeCW88'
  ],
  [
    'bhfaQEExdFeP7nxPAJTrZ2Yisu8QHPA5E5',
    58,
    'X7dCCNyW3oxmstHg7eUQYCdtSopojGWydrZrDaekYR5aybE',
    'T7ZUnM37zmW8VQhHkSABSCP8vNZcNiBb2mXsWmtH3y5KsFu'
  ],
  [
    'bwgm8oEWbVCuP6M93tLbSFxNpDGcDcLWXY',
    23480,
    'XVbf4vggUgqd5vra78CbWdjR3DCLaHtujSAMHSBBYoSEJL9',
    'T7vdopqChePCwSM6krP8QdVKrCU3r1YAgctorfQ59LyU4db'
  ],
  [
    'bwgm8oEWbVCuP6M93tLbSFxNpDGcDcLWXY',
    11747,
    'XVbf4vggUgqd5vra78CbWdjR3DCLaHu5rkPqDDuNEDvNxK9',
    'T7vdopqChePCwSM6krP8QdVKrCU3r1ZkYvMHWu3kqtUkQHr'
  ],
  [
    'bhjbpKUzzGqb26tJtn1aNMbEjxpd2MV1Ze',
    false,
    'X7CgCZQJtrkHH3Jx3ZJ3UyX3nLY3fy8Pr1syK1uFQzjEN8s',
    'T7rDnCZHkZJJ5enZQ4puayHpY8hvdZSRZsbRdZ9MbWo9QT3'
  ],
  [
    'bhjbpKUzzGqb26tJtn1aNMbEjxpd2MV1Ze',
    0,
    'X7CgCZQJtrkHH3Jx3ZJ3UyX3nLY3fy1Do9Wrb7KmNiVS16Z',
    'T7rDnCZHkZJJ5enZQ4puayHpY8hvdZXEkK7sK9ZHq7SrK65'
  ],
  [
    'bhjbpKUzzGqb26tJtn1aNMbEjxpd2MV1Ze',
    1,
    'X7CgCZQJtrkHH3Jx3ZJ3UyX3nLY3fy1NtdScWQ9t75nD6J6',
    'T7rDnCZHkZJJ5enZQ4puayHpY8hvdZXGqoQhFnPRnDWy38y'
  ],
  [
    'bhjbpKUzzGqb26tJtn1aNMbEjxpd2MV1Ze',
    2,
    'X7CgCZQJtrkHH3Jx3ZJ3UyX3nLY3fy1Ezf4ebKzb5TV6H2t',
    'T7rDnCZHkZJJ5enZQ4puayHpY8hvdZXHAHLaKbDYKbUXFzN'
  ],
  [
    'bhjbpKUzzGqb26tJtn1aNMbEjxpd2MV1Ze',
    32,
    'X7CgCZQJtrkHH3Jx3ZJ3UyX3nLY3fy1FFZKQyw1kqqCTUko',
    'T7rDnCZHkZJJ5enZQ4puayHpY8hvdZXimjG1GifHSQQR7ze'
  ],
  [
    'bhjbpKUzzGqb26tJtn1aNMbEjxpd2MV1Ze',
    276,
    'X7CgCZQJtrkHH3Jx3ZJ3UyX3nLY3fy1r6pXH13fY8YzdAWz',
    'T7rDnCZHkZJJ5enZQ4puayHpY8hvdZXdeU7kwoMnPfp7DM8'
  ],
  [
    'bhjbpKUzzGqb26tJtn1aNMbEjxpd2MV1Ze',
    65591,
    'X7CgCZQJtrkHH3Jx3ZJ3UyX3nLY3fytEzdoGSGECQAyfnvH',
    'T7rDnCZHkZJJ5enZQ4puayHpY8hvdZYHAok5jAVUbWD3d2o'
  ],
  [
    'bhjbpKUzzGqb26tJtn1aNMbEjxpd2MV1Ze',
    16781933,
    'X7CgCZQJtrkHH3Jx3ZJ3UyX3nLY3fyuHBav8yh8mzV7o9tn',
    'T7rDnCZHkZJJ5enZQ4puayHpY8hvdZZK3GtEGkpJrbR5jEA'
  ],
  [
    'bhjbpKUzzGqb26tJtn1aNMbEjxpd2MV1Ze',
    4294967294,
    'X7CgCZQJtrkHH3Jx3ZJ3UyX3nLY3fyxptxswTKPPG4Z2Z1j',
    'T7rDnCZHkZJJ5enZQ4puayHpY8hvdZchifzckzcuiu1Ex2N'
  ],
  [
    'bhjbpKUzzGqb26tJtn1aNMbEjxpd2MV1Ze',
    4294967295,
    'X7CgCZQJtrkHH3Jx3ZJ3UyX3nLY3fyxszRyBxEDWWajfdis',
    'T7rDnCZHkZJJ5enZQ4puayHpY8hvdZcnArveEvTsa6wY53c'
  ],
  [
    'bKsa7XNTpJ2oWftVZyqx32sr8K7SCRqkB3',
    false,
    'XV7KZ6KuZnV6XWuFCFxmKfctuu77wrjLaXzCDtCRMnDxdSh',
    'TVPqyo7tRss5ypgRAd6YDf4oPMbGgBP4s6xfXZtAAciwnCM'
  ],
  [
    'bKsa7XNTpJ2oWftVZyqx32sr8K7SCRqkB3',
    0,
    'XV7KZ6KuZnV6XWuFCFxmKfctuu77wrFwHFTGuVn4wya5PXT',
    'TVPqyo7tRss5ypgRAd6YDf4oPMbGgB7UNzQjDwJtmYRZjCr'
  ],
  [
    'bKsa7XNTpJ2oWftVZyqx32sr8K7SCRqkB3',
    13371337,
    'XV7KZ6KuZnV6XWuFCFxmKfctuu77wr1xKYFXRA31qgNxh68',
    'TVPqyo7tRss5ypgRAd6YDf4oPMbGgBXzG5myjc4QSJycgBe'
  ]
]

;[false, true].forEach(isTestAddress => {
  const MAX_32_BIT_UNSIGNED_INT = 4294967295
  const network = isTestAddress ? ' (test)' : ' (main)'

  for (const i in testCases) {
    const testCase = testCases[i]
    const classicAddress = testCase[0] as string
    const tag = testCase[1] !== false ? testCase[1] as number : false
    const xAddress = isTestAddress ? testCase[3] as string : testCase[2] as string
    test(`Converts ${classicAddress}${tag ? ':' + tag : ''} to ${xAddress}${network}`, () => {
      expect(classicAddressToXAddress(classicAddress, tag, isTestAddress)).toBe(xAddress)
      const myClassicAddress = xAddressToClassicAddress(xAddress)
      expect(myClassicAddress).toEqual({
        classicAddress,
        tag,
        test: isTestAddress
      })
      expect(isValidXAddress(xAddress)).toBe(true)
    })
  }

  {
    const classicAddress = 'bGWbZyQqhTp9Xu7G5Pkayo7rXjH4k4QYpf'
    const tag = MAX_32_BIT_UNSIGNED_INT + 1

    test(`Converting ${classicAddress}:${tag}${network} throws`, () => {
      expect(() => {
        classicAddressToXAddress(classicAddress, tag, isTestAddress)
      }).toThrowError(new Error('Invalid tag'))
    })
  }

  {
    const classicAddress = 'r'
    test(`Invalid classic address: Converting ${classicAddress}${network} throws`, () => {
      expect(() => {
        classicAddressToXAddress(classicAddress, false, isTestAddress)
      }).toThrowError(new Error('invalid_input_size: decoded data must have length >= 5'))
    })
  }

  {
    const highAndLowAccounts = [
      Buffer.from('00'.repeat(20), 'hex'),
      Buffer.from('00'.repeat(19) + '01', 'hex'),
      Buffer.from('01'.repeat(20), 'hex'),
      Buffer.from('FF'.repeat(20), 'hex')
    ]

    highAndLowAccounts.forEach(accountId => {
      [false, 0, 1, MAX_32_BIT_UNSIGNED_INT].forEach(t => {
        const tag = (t as number | false)
        const xAddress = encodeXAddress(accountId, tag, isTestAddress)
        test(`Encoding ${accountId.toString('hex')}${tag ? ':' + tag : ''} to ${xAddress} has expected length`, () => {
          expect(xAddress.length).toBe(47)
        })
      })
    })
  }
})

{
  const xAddress = 'XVLhHMPHU98es4dbozjVtdWzVrDjtV5fdx1mHp98tDMoQXa'
  test(`Invalid X-address (bad checksum): Converting ${xAddress} throws`, () => {
    expect(() => {
      xAddressToClassicAddress(xAddress)
    }).toThrowError(new Error('checksum_invalid'))
  })
}

{
  const xAddress = 'dGzKGt8CVpWoa8aWL1k18tAdy9Won3PxynvrrpkAqp3V47g'
  test(`Invalid X-address (bad prefix): Converting ${xAddress} throws`, () => {
    expect(() => {
      xAddressToClassicAddress(xAddress)
    }).toThrowError(new Error('Invalid X-address: bad prefix'))
  })
}

test(`Invalid X-address (64-bit tag) throws`, () => {
  expect(() => {
    // Encoded from:
    // {
    //   classicAddress: 'rGWrZyQqhTp9Xu7G5Pkayo7bXjH4k4QYpf',
    //   tag: MAX_32_BIT_UNSIGNED_INT + 1
    // }
    xAddressToClassicAddress('XVLhHMPHU98es4drozjVtdWzVbDjtV18pX8zeUygYbCgbPh')
  }).toThrowError('Unsupported X-address')
})

test(`Invalid Account ID throws`, () => {
  expect(() => {
    encodeXAddress(Buffer.from('00'.repeat(19), 'hex'), false, false)
  }).toThrowError('Account ID must be 20 bytes')
})

test(`isValidXAddress returns false for invalid X-address`, () => {
  expect(isValidXAddress('XVLhHMPHU98es4dbozjVtdWzVrDjtV18pX8zeUygYrCgrPh')).toBe(false)
})

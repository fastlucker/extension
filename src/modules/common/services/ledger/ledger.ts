import i18n from '@config/localization/localization'
import AppEth from '@ledgerhq/hw-app-eth'
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble'

const ethUtil = require('ethereumjs-util')
const HDNode = require('hdkey')

export const PARENT_HD_PATH = "44'/60'/0'/0"

async function getAddressInternal(transport: any, parentKeyDerivationPath: any) {
  let timeoutHandle: any
  const appEth = new AppEth(transport)

  const ledgerTimeout = new Promise((resolve, reject) => {
    timeoutHandle = setTimeout(() => {
      return reject(new Error('Device took too long to respond...'))
    }, 10000)
  })

  return Promise.race([
    appEth.getAddress(parentKeyDerivationPath, false, true),
    ledgerTimeout
  ]).then((res) => {
    clearTimeout(timeoutHandle)
    return res
  })
}

export function addressOfHDKey(hdKey: any) {
  const shouldSanitizePublicKey = true
  const derivedPublicKey = hdKey.publicKey
  const ethereumAddressUnprefixed = ethUtil
    .publicToAddress(derivedPublicKey, shouldSanitizePublicKey)
    .toString('hex')
  return ethUtil.addHexPrefix(ethereumAddressUnprefixed).toLowerCase()
}

function calculateDerivedHDKeyInfos(initialDerivedKeyInfo: any, count: any) {
  const derivedKeys = []
  for (let i = 0; i < count; i++) {
    const fullDerivationPath = `m/${initialDerivedKeyInfo.baseDerivationPath}/${i}`
    const path = `m/${i}`
    const hdKey = initialDerivedKeyInfo.hdKey.derive(path)
    const address = addressOfHDKey(hdKey)
    const derivedKey = {
      address,
      hdKey,
      baseDerivationPath: initialDerivedKeyInfo.baseDerivationPathh,
      derivationPath: fullDerivationPath
    }

    derivedKeys.push(derivedKey)
  }
  return derivedKeys
}

async function getAccounts(transport: any) {
  const parentKeyDerivationPath = `m/${PARENT_HD_PATH}`
  const returnData: any = {
    error: null,
    accounts: []
  }
  let ledgerResponse
  try {
    ledgerResponse = await getAddressInternal(transport, parentKeyDerivationPath)
      .then((o: any) => o)
      .catch((err: any) => {
        if (err.statusCode === 25871 || err.statusCode === 27404) {
          returnData.error = i18n.t(
            'Please make sure your ledger is unlocked and running the Ethereum app. {{error}}',
            { error: err.message }
          )
        } else {
          returnData.error = i18n.t('Could not get address from ledger : {{error}}', { error: err })
        }
      })
  } catch (e) {
    console.log('e', e)
  }

  if (!ledgerResponse) {
    return returnData
  }

  const hdKey = new HDNode()
  hdKey.publicKey = Buffer.from(ledgerResponse.publicKey, 'hex')
  hdKey.chainCode = Buffer.from(ledgerResponse.chainCode, 'hex')
  const mainAddress = addressOfHDKey(hdKey)

  const initialDerivedKeyInfo = {
    hdKey,
    address: mainAddress,
    derivationPath: parentKeyDerivationPath,
    baseDerivationPath: PARENT_HD_PATH
  }

  // currently we can't get addrs to match with what appears in MM/Ledger live so only one is derived
  returnData.accounts = calculateDerivedHDKeyInfos(initialDerivedKeyInfo, 1)
  return returnData
}

export async function ledgerDeviceGetAddresses(deviceId: string) {
  const returnData = {
    error: null,
    addresses: []
  }

  const transport = await TransportBLE.open(deviceId).catch((err: any) => {
    returnData.error = err
  })
  if (!transport) return returnData

  const accountsData = await getAccounts(transport)

  transport.close()

  if (accountsData.error) {
    returnData.error = accountsData.error
  } else {
    returnData.addresses = accountsData.accounts.map((a: any) => a.address)
  }

  return returnData
}

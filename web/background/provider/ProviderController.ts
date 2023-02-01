import 'reflect-metadata'

import networks from 'ambire-common/src/constants/networks'
import { getProvider } from 'ambire-common/src/services/provider'
import { ethErrors } from 'eth-rpc-errors'
import { intToHex } from 'ethereumjs-util'
import cloneDeep from 'lodash/cloneDeep'

import permissionService from '@web/background/services/permission'
import sessionService, { Session } from '@web/background/services/session'
import Wallet from '@web/background/wallet'
import storage from '@web/background/webapi/storage'
import { SAFE_RPC_METHODS } from '@web/constants/common'

interface ApprovalRes {
  type?: string
  address?: string
  uiRequestComponent?: string
  isSend?: boolean
  isSpeedUp?: boolean
  isCancel?: boolean
  isSwap?: boolean
  isGnosis?: boolean
  // TODO:
  account?: any
  extra?: Record<string, any>
  traceId?: string
  $ctx?: any
  signingTxId?: string
}

interface Web3WalletPermission {
  // The name of the method corresponding to the permission
  parentCapability: string

  // The date the permission was granted, in UNIX epoch time
  date?: number
}

const v1SignTypedDataValidation = ({
  data: {
    params: [_, from]
  }
}) => {
  // TODO:
  // const currentAddress = preferenceService.getCurrentAccount()?.address.toLowerCase()
  // if (from.toLowerCase() !== currentAddress)
  //   throw ethErrors.rpc.invalidParams('from should be same as current address')
}
const signTypedDataValidation = ({
  data: {
    params: [from, _]
  }
}) => {
  // const currentAddress = preferenceService.getCurrentAccount()?.address.toLowerCase()
  // if (from.toLowerCase() !== currentAddress)
  //   throw ethErrors.rpc.invalidParams('from should be same as current address')
}

class ProviderController {
  ethRpc = async (req) => {
    const {
      data: { method, params },
      session: { origin }
    } = req

    const networkId = await storage.get('networkId')
    const provider = getProvider(networkId)

    if (!permissionService.hasPermission(origin) && !SAFE_RPC_METHODS.includes(method)) {
      throw ethErrors.provider.unauthorized()
    }

    if (method === 'eth_estimateGas') {
      return provider.estimateGas(params[0])
    }

    if (method === 'eth_blockNumber') {
      return provider.getBlockNumber()
    }

    // TODO: handle the rest of the SAFE_RPC_METHODS
  }

  ethRequestAccounts = async ({ session: { origin } }) => {
    if (!permissionService.hasPermission(origin)) {
      throw ethErrors.provider.unauthorized()
    }
    const selectedAcc = await storage.get('selectedAcc')

    const account = selectedAcc ? [selectedAcc] : []
    sessionService.broadcastEvent('accountsChanged', account)

    return account
  }

  @Reflect.metadata('SAFE', true)
  ethAccounts = async ({ session: { origin } }) => {
    if (!permissionService.hasPermission(origin) || !Wallet.isUnlocked()) {
      return []
    }

    const selectedAcc = await storage.get('selectedAcc')

    return selectedAcc ? [selectedAcc] : []
  }

  ethCoinbase = async ({ session: { origin } }) => {
    if (!permissionService.hasPermission(origin)) {
      return null
    }

    const selectedAcc = await storage.get('selectedAcc')

    return selectedAcc || null
  }

  @Reflect.metadata('SAFE', true)
  ethChainId = async () => {
    const networkId = await storage.get('networkId')
    const network = networks.find((n) => n.id === networkId)
    return intToHex(network?.chainId || networks[0].chainId)
  }

  @Reflect.metadata('APPROVAL', ['send-txn', false])
  ethSendTransaction = async (options: {
    data: {
      $ctx?: any
      params: any
    }
    session: Session
    approvalRes: ApprovalRes
    pushed: boolean
    result: any
  }) => {
    if (options.pushed) return options.result

    const {
      data: {
        params: [txParams]
      },
      session: { origin },
      approvalRes
    } = cloneDeep(options)

    console.log('txParams', txParams)
  }

  @Reflect.metadata('SAFE', true)
  netVersion = async () => {
    const networkId = await storage.get('networkId')
    const network = networks.find((n) => n.id === networkId)

    return network?.chainId ? network?.chainId.toString() : '1'
  }

  @Reflect.metadata('SAFE', true)
  web3ClientVersion = () => {
    // TODO:
    return 'TODO'
    // return `Rabby/${process.env.release}`
  }

  @Reflect.metadata('APPROVAL', [
    'SignText',
    ({
      data: {
        params: [_, from]
      }
    }) => {
      // TODO:
      // const currentAddress = preferenceService.getCurrentAccount()?.address.toLowerCase()
      // if (from.toLowerCase() !== currentAddress)
      //   throw ethErrors.rpc.invalidParams('from should be same as current address')
    }
  ])
  personalSign = async ({ data, approvalRes, session }) => {
    // TODO:
    if (!data.params) return
  }

  @Reflect.metadata('APPROVAL', ['SignTypedData', v1SignTypedDataValidation])
  ethSignTypedData = async ({
    data: {
      params: [data, from]
    },
    session,
    approvalRes
  }) => {
    // TODO:
  }

  @Reflect.metadata('APPROVAL', ['SignTypedData', v1SignTypedDataValidation])
  ethSignTypedDataV1 = async ({
    data: {
      params: [data, from]
    },
    session,
    approvalRes
  }) => {}

  @Reflect.metadata('APPROVAL', ['SignTypedData', signTypedDataValidation])
  ethSignTypedDataV3 = async ({
    data: {
      params: [from, data]
    },
    session,
    approvalRes
  }) => {}

  @Reflect.metadata('APPROVAL', ['SignTypedData', signTypedDataValidation])
  ethSignTypedDataV4 = async ({
    data: {
      params: [from, data]
    },
    session,
    approvalRes
  }) => {}

  @Reflect.metadata('APPROVAL', ['switch-network', false])
  walletAddEthereumChain = ({
    data: {
      params: [chainParams]
    },
    session: { origin },
    approvalRes
  }: {
    data: {
      params: any[]
    }
    session: {
      origin: string
    }
    approvalRes?: {
      chain: any
      rpcUrl: string
    }
  }) => {
    let chainId = chainParams.chainId
    if (typeof chainId === 'string') {
      chainId = Number(chainId)
    }

    const network = networks.find((n) => n.chainId === chainId)

    if (!network) {
      throw new Error('This chain is not supported by Ambire yet.')
    }

    // sessionService.broadcastEvent('ambire:chainChanged', network, origin)
    sessionService.broadcastEvent(
      'chainChanged',
      {
        chain: intToHex(network.chainId),
        networkVersion: `${network.chainId}`
      },
      origin
    )

    return null
  }

  @Reflect.metadata('APPROVAL', ['switch-network', false])
  walletSwitchEthereumChain = ({
    data: {
      params: [chainParams]
    },
    session: { origin }
  }) => {
    let chainId = chainParams.chainId
    if (typeof chainId === 'string') {
      chainId = Number(chainId)
    }

    const network = networks.find((n) => n.chainId === chainId)

    if (!network) {
      throw new Error('This chain is not supported by Ambire yet.')
    }

    // sessionService.broadcastEvent('ambire:chainChanged', network, origin)
    sessionService.broadcastEvent(
      'chainChanged',
      {
        chain: intToHex(network.chainId),
        networkVersion: `${network.chainId}`
      },
      origin
    )

    return null
  }

  @Reflect.metadata('APPROVAL', ['AddAsset', () => null])
  walletWatchAsset = () => {
    throw new Error('Ambire does not support adding tokens in this way for now.')
  }

  walletRequestPermissions = ({ data: { params: permissions } }) => {
    const result: Web3WalletPermission[] = []
    if (permissions && 'eth_accounts' in permissions[0]) {
      result.push({ parentCapability: 'eth_accounts' })
    }
    return result
  }

  @Reflect.metadata('SAFE', true)
  walletGetPermissions = ({ session: { origin } }) => {
    const result: Web3WalletPermission[] = []
    if (Wallet.isUnlocked() && Wallet.getConnectedSite(origin)) {
      result.push({ parentCapability: 'eth_accounts' })
    }
    return result
  }

  personalEcRecover = ({
    data: {
      params: [data, sig, extra = {}]
    }
  }) => {
    // TODO:
  }

  @Reflect.metadata('SAFE', true)
  netListening = () => {
    return true
  }
}

export default new ProviderController()

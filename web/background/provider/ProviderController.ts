import 'reflect-metadata'

import networks from 'ambire-common/src/constants/networks'
import { ethErrors } from 'eth-rpc-errors'
import { intToHex } from 'ethereumjs-util'
import { ethers } from 'ethers'

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
  ethRequestAccounts = async ({ session: { origin } }) => {
    if (!permissionService.hasPermission(origin)) {
      throw ethErrors.provider.unauthorized()
    }
    const selectedAcc = await storage.get('selectedAcc')

    const account = selectedAcc ? [selectedAcc] : []
    sessionService.broadcastEvent('accountsChanged', account)

    const connectSite = permissionService.getConnectedSite(origin)
    if (connectSite) {
      console.log('connectSite.chain', connectSite.chain)
      // // ambire:chainChanged event must be sent before chainChanged event
      // sessionService.broadcastEvent('ambire:chainChanged', chain, origin)
      // sessionService.broadcastEvent(
      //   'chainChanged',
      //   {
      //     chain: chain.hex,
      //     networkVersion: chain.network
      //   },
      //   origin
      // )
    }

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
    console.log('ethCoinbase', origin)
    if (!permissionService.hasPermission(origin)) {
      return null
    }

    // TODO:
    return null
  }

  @Reflect.metadata('SAFE', true)
  ethChainId = async ({ session }: { session: Session }) => {
    const origin = session.origin
    const site = permissionService.getWithoutUpdate(origin)
    console.log('ethChainId site', site)
    const networkId = await storage.get('networkId')
    const network = networks.find((n) => n.id === networkId)
    return ethers.utils.hexlify(network?.chainId || networks[0].chainId)
  }

  @Reflect.metadata('APPROVAL', [
    'SignTx',
    ({
      data: {
        params: [tx]
      },
      session
    }) => {
      // TODO:
      // const currentAddress = preferenceService.getCurrentAccount()?.address.toLowerCase()
      // const currentChain = permissionService.isInternalOrigin(session.origin)
      //   ? Object.values(CHAINS).find((chain) => chain.id === tx.chainId)!.enum
      //   : permissionService.getConnectedSite(session.origin)?.chain
      // if (tx.from.toLowerCase() !== currentAddress) {
      //   throw ethErrors.rpc.invalidParams('from should be same as current address')
      // }
      // if ('chainId' in tx && (!currentChain || Number(tx.chainId) !== CHAINS[currentChain].id)) {
      //   throw ethErrors.rpc.invalidParams('chainId should be same as current chainId')
      // }
    }
  ])
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
    // TODO:
  }

  @Reflect.metadata('SAFE', true)
  netVersion = (req) => {
    return this.ethRpc({
      ...req,
      data: { method: 'net_version', params: [] }
    })
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

  @Reflect.metadata('APPROVAL', ['AddChain', false])
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
    // TODO:
    return null
  }

  @Reflect.metadata('APPROVAL', ['switch-network', false])
  walletSwitchEthereumChain = ({
    data: {
      params: [chainParams]
    },
    session: { origin }
  }) => {
    console.log('walletSwitchEthereumChain', chainParams, origin)

    let chainId = chainParams.chainId
    if (typeof chainId === 'string') {
      chainId = Number(chainId)
    }

    const network = networks.find((n) => n.chainId === chainId)

    if (!network) {
      throw new Error('This chain is not supported by Ambire yet.')
    }

    sessionService.broadcastEvent('ambire:chainChanged', network, origin)
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

  @Reflect.metadata('PRIVATE', true)
  private _checkAddress = async (address) => {
    // TODO:
  }
}

export default new ProviderController()

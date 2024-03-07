/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import 'reflect-metadata'

import { ethErrors } from 'eth-rpc-errors'
import { JsonRpcProvider, toBeHex } from 'ethers'
import cloneDeep from 'lodash/cloneDeep'

import { networks as commonNetworks } from '@ambire-common/consts/networks'
import { MainController } from '@ambire-common/controllers/main/main'
import { isErc4337Broadcast } from '@ambire-common/libs/userOperation/userOperation'
import bundler from '@ambire-common/services/bundlers'
import { getProvider } from '@ambire-common/services/provider'
import { APP_VERSION } from '@common/config/env'
import { NETWORKS } from '@common/constants/networks'
import { delayPromise } from '@common/utils/promises'
import { SAFE_RPC_METHODS } from '@web/constants/common'
import { DappsController } from '@web/extension-services/background/controllers/dapps'
import permissionService from '@web/extension-services/background/services/permission'
import { Session } from '@web/extension-services/background/services/session'

interface RequestRes {
  type?: string
  address?: string
  uiRequestComponent?: string
  isSend?: boolean
  isSpeedUp?: boolean
  isCancel?: boolean
  isSwap?: boolean
  isGnosis?: boolean
  account?: any
  extra?: Record<string, any>
  traceId?: string
  $ctx?: any
  signingTxId?: string
  hash?: string
  error?: string
}

interface Web3WalletPermission {
  // The name of the method corresponding to the permission
  parentCapability: string

  // The date the permission was granted, in UNIX epoch time
  date?: number
}

const handleSignMessage = (requestRes: RequestRes) => {
  if (requestRes) {
    if (requestRes?.error) {
      throw ethErrors.rpc.invalidParams({
        message: requestRes?.error
      })
    }

    return requestRes?.hash
  }

  throw new Error('Internal error: request result not found', requestRes)
}

export class ProviderController {
  mainCtrl: MainController

  dappsCtrl: DappsController

  constructor(mainCtrl: MainController, dappsCtrl: DappsController) {
    this.mainCtrl = mainCtrl
    this.dappsCtrl = dappsCtrl
  }

  getDappNetwork = (origin: string) => {
    const defaultNetwork = this.mainCtrl.settings.networks.find((n) => n.id === NETWORKS.ethereum)
    if (!defaultNetwork)
      throw new Error(
        'Missing default network data, which should never happen. Please contact support.'
      )

    const dappChainId = permissionService.getConnectedSite(origin)?.chainId
    if (!dappChainId) return defaultNetwork

    return (
      this.mainCtrl.settings.networks.find((n) => n.chainId === BigInt(dappChainId)) ||
      defaultNetwork
    )
  }

  ethRpc = async (req: any) => {
    const {
      data: { method, params },
      session: { origin }
    } = req

    const networkId = this.getDappNetwork(origin).id
    const provider: JsonRpcProvider = getProvider(networkId)

    if (!permissionService.hasPermission(origin) && !SAFE_RPC_METHODS.includes(method)) {
      throw ethErrors.provider.unauthorized()
    }

    return provider.send(method, params)
  }

  ethRequestAccounts = async ({ session: { origin } }: any) => {
    if (!permissionService.hasPermission(origin) || !this.mainCtrl.keystore.isUnlocked) {
      throw ethErrors.provider.unauthorized()
    }

    const account = this.mainCtrl.selectedAccount ? [this.mainCtrl.selectedAccount] : []
    this.dappsCtrl.broadcastDappSessionEvent('accountsChanged', account)

    return account
  }

  @Reflect.metadata('SAFE', true)
  ethAccounts = async ({ session: { origin } }: any) => {
    if (!permissionService.hasPermission(origin) || !this.mainCtrl.keystore.isUnlocked) {
      return []
    }

    return this.mainCtrl.selectedAccount ? [this.mainCtrl.selectedAccount] : []
  }

  ethCoinbase = async ({ session: { origin } }: any) => {
    if (!permissionService.hasPermission(origin) || !this.mainCtrl.keystore.isUnlocked) {
      return null
    }

    return this.mainCtrl.selectedAccount || null
  }

  @Reflect.metadata('SAFE', true)
  ethChainId = async ({ session: { origin } }: any) => {
    if (permissionService.hasPermission(origin)) {
      return toBeHex(permissionService.getConnectedSite(origin)?.chainId || 1)
    }
    return toBeHex(1)
  }

  @Reflect.metadata('NOTIFICATION_REQUEST', ['SendTransaction', false])
  ethSendTransaction = async (options: {
    data: {
      $ctx?: any
      params: any
    }
    session: Session
    requestRes: RequestRes
    pushed: boolean
    result: any
  }) => {
    if (options.pushed) return options.result

    const { requestRes } = cloneDeep(options)

    if (requestRes?.hash) {
      // @erc4337
      // check if the request is erc4337
      // if it is, the received requestRes?.hash is an userOperationHash
      // Call the bundler to receive the transaction hash needed by the dapp
      const dappNetwork = this.getDappNetwork(options.session.origin)
      const network = commonNetworks.filter((net) => net.id === dappNetwork.id)[0]
      const accountState = this.mainCtrl.accountStates[this.mainCtrl.selectedAccount!][network.id]
      const is4337Broadcast = isErc4337Broadcast(network, accountState)
      let hash = requestRes?.hash
      if (is4337Broadcast) {
        const receipt = await bundler.poll(hash, network)
        hash = receipt.receipt.transactionHash
      }

      // delay just for better UX
      await delayPromise(400)
      return hash
    }

    throw new Error('Transaction failed!')
  }

  @Reflect.metadata('SAFE', true)
  netVersion = ({ session: { origin } }: any) => this.getDappNetwork(origin).chainId.toString()

  @Reflect.metadata('SAFE', true)
  web3ClientVersion = () => {
    return `Ambire v${APP_VERSION}`
  }

  @Reflect.metadata('NOTIFICATION_REQUEST', ['SignText', false])
  personalSign = async ({ requestRes }: any) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('NOTIFICATION_REQUEST', ['SignText', false])
  ethSign = async ({ requestRes }: any) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('NOTIFICATION_REQUEST', ['SignTypedData', false])
  ethSignTypedData = async ({ requestRes }: any) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('NOTIFICATION_REQUEST', ['SignTypedData', false])
  ethSignTypedDataV1 = async ({ requestRes }: any) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('NOTIFICATION_REQUEST', ['SignTypedData', false])
  ethSignTypedDataV3 = async ({ requestRes }: any) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('NOTIFICATION_REQUEST', ['SignTypedData', false])
  ethSignTypedDataV4 = async ({ requestRes }: any) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('NOTIFICATION_REQUEST', [
    'AddChain',
    ({ data, session, mainCtrl }: any) => {
      if (!data.params[0]) {
        throw ethErrors.rpc.invalidParams('params is required but got []')
      }
      if (!data.params[0]?.chainId) {
        throw ethErrors.rpc.invalidParams('chainId is required')
      }
      const connected = permissionService.getConnectedSite(session.origin)

      const { chainId } = data.params[0]
      const network = mainCtrl.settings.networks.find(
        (n: any) => Number(n.chainId) === Number(chainId)
      )
      if (!network || !connected) return false

      return true
    }
  ])
  walletAddEthereumChain = ({
    data: {
      params: [chainParams]
    },
    session: { origin }
  }: {
    data: {
      params: any[]
    }
    session: {
      origin: string
    }
    requestRes?: {
      chain: any
      rpcUrl: string
    }
  }) => {
    let chainId = chainParams.chainId
    if (typeof chainId === 'string') {
      chainId = Number(chainId)
    }

    const network = this.mainCtrl.settings.networks.find((n) => Number(n.chainId) === chainId)

    if (!network) {
      throw new Error('This chain is not supported by Ambire yet.')
    }

    this.dappsCtrl.broadcastDappSessionEvent(
      'chainChanged',
      {
        chain: toBeHex(network.chainId),
        networkVersion: `${network.chainId}`
      },
      origin
    )

    return null
  }

  @Reflect.metadata('NOTIFICATION_REQUEST', [
    'AddChain',
    ({ data, session, mainCtrl }: any) => {
      if (!data.params[0]) {
        throw ethErrors.rpc.invalidParams('params is required but got []')
      }
      if (!data.params[0]?.chainId) {
        throw ethErrors.rpc.invalidParams('chainId is required')
      }
      const connected = permissionService.getConnectedSite(session.origin)
      const { chainId } = data.params[0]
      const network = mainCtrl.settings.networks.find(
        (n: any) => Number(n.chainId) === Number(chainId)
      )
      if (!network || !connected) return false

      return true
    }
  ])
  walletSwitchEthereumChain = ({
    data: {
      params: [chainParams]
    },
    session: { origin }
  }: any) => {
    let chainId = chainParams.chainId
    if (typeof chainId === 'string') {
      chainId = Number(chainId)
    }
    const network = this.mainCtrl.settings.networks.find((n) => Number(n.chainId) === chainId)

    if (!network) {
      throw new Error('This chain is not supported by Ambire yet.')
    }

    permissionService.updateConnectSite(origin, { chainId }, true)
    this.dappsCtrl.broadcastDappSessionEvent(
      'chainChanged',
      {
        chain: toBeHex(network.chainId),
        networkVersion: `${network.chainId}`
      },
      origin
    )

    return null
  }

  @Reflect.metadata('NOTIFICATION_REQUEST', ['WalletWatchAsset', false])
  walletWatchAsset = () => true

  @Reflect.metadata('NOTIFICATION_REQUEST', ['GetEncryptionPublicKey', false])
  ethGetEncryptionPublicKey = ({ requestRes }: { requestRes: string }) => ({
    result: requestRes
  })

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
    if (permissionService.getConnectedSite(origin) && this.mainCtrl.keystore.isUnlocked) {
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

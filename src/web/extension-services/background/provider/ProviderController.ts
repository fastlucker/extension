/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import 'reflect-metadata'

import networks from 'ambire-common/src/constants/networks'
import { getProvider } from 'ambire-common/src/services/provider'
import { ethErrors } from 'eth-rpc-errors'
import { intToHex } from 'ethereumjs-util'
import cloneDeep from 'lodash/cloneDeep'

import { APP_VERSION } from '@config/env'
import { SAFE_RPC_METHODS } from '@web/constants/common'
import permissionService from '@web/extension-services/background/services/permission'
import sessionService, { Session } from '@web/extension-services/background/services/session'
import Wallet from '@web/extension-services/background/wallet'
import storage from '@web/extension-services/background/webapi/storage'

interface ApprovalRes {
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

const handleSignMessage = (approvalRes: ApprovalRes) => {
  if (approvalRes) {
    if (approvalRes?.error) {
      throw ethErrors.rpc.invalidParams({
        message: approvalRes?.error
      })
    }

    return approvalRes?.hash
  }

  throw new Error('Internal error: approval result not found', approvalRes)
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

    // Ambire modifies the txn data but dapps need the original txn data that has been requested on ethSendTransaction
    // therefore we override the data stored on the blockchain with the original one
    if (method === 'eth_getTransactionByHash') {
      let fetchedTx = null
      let failed = 0
      while (fetchedTx === null && failed < 3) {
        fetchedTx = await provider.getTransaction(params[0])
        if (fetchedTx === null) {
          await new Promise((r) => setTimeout(r, 1500))
          failed++
        }
      }

      if (fetchedTx) {
        const response = provider._wrapTransaction(fetchedTx, params[0])
        const txs = await storage.get('transactionHistory')
        if (txs[params[0]]) {
          const txn = JSON.parse(txs[params[0]])
          if (txn?.data) {
            response.data = txn?.data
          }
        }

        return response
      }

      return provider.getTransaction(params[0])
    }

    return provider.send(method, params)
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

  @Reflect.metadata('APPROVAL', ['SendTransaction', false])
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
      approvalRes
    } = cloneDeep(options)

    if (approvalRes) {
      const txnHistory = (await storage.get('transactionHistory')) || {}
      txnHistory[approvalRes.hash || ''] = JSON.stringify(txParams)
      await storage.set('transactionHistory', txnHistory)
      return approvalRes?.hash
    }

    throw new Error('Transaction failed!')
  }

  @Reflect.metadata('SAFE', true)
  netVersion = async () => {
    const networkId = await storage.get('networkId')
    const network = networks.find((n) => n.id === networkId)

    return network?.chainId ? network?.chainId.toString() : '1'
  }

  @Reflect.metadata('SAFE', true)
  web3ClientVersion = () => {
    return `Ambire v${APP_VERSION}`
  }

  @Reflect.metadata('APPROVAL', ['SignText', false])
  personalSign = async ({ approvalRes }: any) => {
    return handleSignMessage(approvalRes)
  }

  @Reflect.metadata('APPROVAL', ['SignText', false])
  ethSign = async ({ approvalRes }: any) => {
    return handleSignMessage(approvalRes)
  }

  @Reflect.metadata('APPROVAL', ['SignTypedData', false])
  ethSignTypedData = async ({ approvalRes }: any) => {
    return handleSignMessage(approvalRes)
  }

  @Reflect.metadata('APPROVAL', ['SignTypedData', false])
  ethSignTypedDataV1 = async ({ approvalRes }: any) => {
    return handleSignMessage(approvalRes)
  }

  @Reflect.metadata('APPROVAL', ['SignTypedData', false])
  ethSignTypedDataV3 = async ({ approvalRes }: any) => {
    return handleSignMessage(approvalRes)
  }

  @Reflect.metadata('APPROVAL', ['SignTypedData', false])
  ethSignTypedDataV4 = async ({ approvalRes }: any) => {
    return handleSignMessage(approvalRes)
  }

  @Reflect.metadata('APPROVAL', ['SwitchNetwork', false])
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

  @Reflect.metadata('APPROVAL', ['SwitchNetwork', false])
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

  @Reflect.metadata('APPROVAL', ['WalletWatchAsset', false])
  walletWatchAsset = () => true

  @Reflect.metadata('APPROVAL', ['GetEncryptionPublicKey', false])
  ethGetEncryptionPublicKey = ({ approvalRes }: { approvalRes: string }) => ({
    result: approvalRes
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

/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata'

import { ethErrors } from 'eth-rpc-errors'
import { toBeHex } from 'ethers'
import cloneDeep from 'lodash/cloneDeep'

import { MainController } from '@ambire-common/controllers/main/main'
import { DappProviderRequest } from '@ambire-common/interfaces/dapp'
import {
  AccountOpIdentifiedBy,
  fetchTxnId,
  isIdentifiedByTxn,
  pollTxnId
} from '@ambire-common/libs/accountOp/submittedAccountOp'
import { calculateAccountPortfolio } from '@ambire-common/libs/portfolio/portfolioView'
import { getRpcProvider } from '@ambire-common/services/provider'
import { APP_VERSION, isProd } from '@common/config/env'
import formatDecimals from '@common/utils/formatDecimals'
import { delayPromise } from '@common/utils/promises'
import { SAFE_RPC_METHODS } from '@web/constants/common'
import { notificationManager } from '@web/extension-services/background/webapi/notification'

import { RequestRes, Web3WalletPermission } from './types'

type ProviderRequest = DappProviderRequest & { requestRes: RequestRes }

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

  isUnlocked: boolean

  constructor(mainCtrl: MainController) {
    this.mainCtrl = mainCtrl

    this.isUnlocked = this.mainCtrl.keystore.isReadyToStoreKeys
      ? this.mainCtrl.keystore.isUnlocked
      : true
  }

  _internalGetAccounts = (origin: string) => {
    const WHITELISTED_ORIGINS = ['https://legends.ambire.com', 'https://legends-staging.ambire.com']

    if (!isProd) {
      // Legends local dev
      WHITELISTED_ORIGINS.push('http://localhost:19006')
      WHITELISTED_ORIGINS.push('http://localhost:19007')
    }

    if (WHITELISTED_ORIGINS.includes(origin)) {
      const allOtherAccountAddresses = this.mainCtrl.accounts.accounts.reduce((prevValue, acc) => {
        if (acc.addr !== this.mainCtrl.accounts.selectedAccount) {
          prevValue.push(acc.addr)
        }

        return prevValue
      }, [] as string[])

      // Selected account goes first in the list
      return [this.mainCtrl.accounts.selectedAccount, ...allOtherAccountAddresses]
    }

    return this.mainCtrl.accounts.selectedAccount ? [this.mainCtrl.accounts.selectedAccount] : []
  }

  getDappNetwork = (origin: string) => {
    const defaultNetwork = this.mainCtrl.networks.networks.find((n) => n.id === 'ethereum')
    if (!defaultNetwork)
      throw new Error(
        'Missing default network data, which should never happen. Please contact support.'
      )

    const dappChainId = this.mainCtrl.dapps.getDapp(origin)?.chainId
    if (!dappChainId) return defaultNetwork

    return (
      this.mainCtrl.networks.networks.find((n) => n.chainId === BigInt(dappChainId)) ||
      defaultNetwork
    )
  }

  ethRpc = async (request: DappProviderRequest) => {
    const {
      method,
      params,
      session: { origin }
    } = request

    const networkId = this.getDappNetwork(origin).id
    const provider = this.mainCtrl.providers.providers[networkId]

    if (!this.mainCtrl.dapps.hasPermission(origin) && !SAFE_RPC_METHODS.includes(method)) {
      throw ethErrors.provider.unauthorized()
    }

    return provider.send(method, params)
  }

  ethRequestAccounts = async ({ session: { origin } }: DappProviderRequest) => {
    if (!this.mainCtrl.dapps.hasPermission(origin) || !this.isUnlocked) {
      throw ethErrors.provider.unauthorized()
    }

    const account = this._internalGetAccounts(origin)

    this.mainCtrl.dapps.broadcastDappSessionEvent('accountsChanged', account)

    return account
  }

  getPortfolioBalance = async ({ session: { origin } }: DappProviderRequest) => {
    if (!this.mainCtrl.dapps.hasPermission(origin) || !this.isUnlocked) {
      return null
    }

    const hasSignAccOp = !!this.mainCtrl.actions?.visibleActionsQueue?.filter(
      (action) => action.type === 'accountOp'
    )

    const portfolio = calculateAccountPortfolio(
      this.mainCtrl.accounts.selectedAccount,
      this.mainCtrl.portfolio,
      undefined,
      hasSignAccOp
    )

    return {
      amount: portfolio.totalAmount,
      amountFormatted: formatDecimals(portfolio.totalAmount, 'price'),
      isReady: portfolio.isAllReady
    }
  }

  @Reflect.metadata('SAFE', true)
  ethAccounts = async ({ session: { origin } }: DappProviderRequest) => {
    if (!this.mainCtrl.dapps.hasPermission(origin) || !this.isUnlocked) {
      return []
    }

    return this._internalGetAccounts(origin)
  }

  ethCoinbase = async ({ session: { origin } }: DappProviderRequest) => {
    if (!this.mainCtrl.dapps.hasPermission(origin) || !this.isUnlocked) {
      return null
    }

    return this.mainCtrl.accounts.selectedAccount || null
  }

  @Reflect.metadata('SAFE', true)
  ethChainId = async ({ session: { origin } }: DappProviderRequest) => {
    if (this.mainCtrl.dapps.hasPermission(origin)) {
      return toBeHex(this.mainCtrl.dapps.getDapp(origin)?.chainId || 1)
    }
    return toBeHex(1)
  }

  @Reflect.metadata('ACTION_REQUEST', ['SendTransaction', false])
  ethSendTransaction = async (request: ProviderRequest) => {
    const { requestRes } = cloneDeep(request)
    if (requestRes?.hash) return requestRes.hash
    throw new Error('Transaction failed!')
  }

  @Reflect.metadata('SAFE', true)
  netVersion = ({ session: { origin } }: any) => this.getDappNetwork(origin).chainId.toString()

  @Reflect.metadata('SAFE', true)
  web3ClientVersion = () => {
    return `Ambire v${APP_VERSION}`
  }

  @Reflect.metadata('ACTION_REQUEST', ['SignText', false])
  personalSign = async ({ requestRes }: ProviderRequest) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('ACTION_REQUEST', ['SignTypedData', false])
  ethSignTypedData = async ({ requestRes }: ProviderRequest) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('ACTION_REQUEST', ['SignTypedData', false])
  ethSignTypedDataV1 = async ({ requestRes }: ProviderRequest) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('ACTION_REQUEST', ['SignTypedData', false])
  ethSignTypedDataV3 = async ({ requestRes }: ProviderRequest) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('ACTION_REQUEST', ['SignTypedData', false])
  ethSignTypedDataV4 = async ({ requestRes }: ProviderRequest) => {
    return handleSignMessage(requestRes)
  }

  @Reflect.metadata('ACTION_REQUEST', [
    'AddChain',
    ({ request, mainCtrl }: { request: ProviderRequest; mainCtrl: MainController }) => {
      const { params, session } = request
      if (!params[0]) {
        throw ethErrors.rpc.invalidParams('params is required but got []')
      }
      if (!params[0]?.chainId) {
        throw ethErrors.rpc.invalidParams('chainId is required')
      }
      const dapp = mainCtrl.dapps.getDapp(session.origin)
      const { chainId } = params[0]
      const network = mainCtrl.networks.networks.find(
        (n: any) => Number(n.chainId) === Number(chainId)
      )
      if (!network || !dapp?.isConnected) return false

      return true
    }
  ])
  walletAddEthereumChain = ({
    params: [chainParams],
    session: { origin, name }
  }: ProviderRequest) => {
    let chainId = chainParams.chainId
    if (typeof chainId === 'string') {
      chainId = Number(chainId)
    }

    const network = this.mainCtrl.networks.networks.find((n) => Number(n.chainId) === chainId)

    if (!network) {
      throw new Error('This chain is not supported by Ambire yet.')
    }

    this.mainCtrl.dapps.updateDapp(origin, { chainId })
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      await notificationManager.create({
        title: 'Network added',
        message: `Network switched to ${network.name} for ${name || origin}.`
      })
    })()
    this.mainCtrl.dapps.broadcastDappSessionEvent(
      'chainChanged',
      {
        chain: `0x${network.chainId.toString(16)}`,
        networkVersion: `${network.chainId}`
      },
      origin
    )

    return null
  }

  // explain to the dapp what features the wallet has for the selected account
  walletGetCapabilities = async (data: any) => {
    if (!this.mainCtrl.dapps.hasPermission(data.session.origin) || !this.isUnlocked) {
      throw ethErrors.provider.unauthorized()
    }

    if (!data.params || !data.params.length) {
      throw ethErrors.rpc.invalidParams('params is required but got []')
    }

    const accountAddr = data.params[0]
    const state = this.mainCtrl.accounts.accountStates[accountAddr]
    if (!state) {
      throw ethErrors.rpc.invalidParams(`account with address ${accountAddr} does not exist`)
    }

    const capabilities: any = {}
    this.mainCtrl.networks.networks.forEach((network) => {
      capabilities[toBeHex(network.chainId)] = {
        atomicBatch: {
          supported: !this.mainCtrl.accounts.accountStates[accountAddr][network.id].isEOA
        }
      }
    })
    return capabilities
  }

  @Reflect.metadata('ACTION_REQUEST', ['SendTransaction', false])
  walletSendCalls = async (data: any) => {
    if (data.requestRes && data.requestRes.submittedAccountOp) {
      const identifiedBy = data.requestRes.submittedAccountOp.identifiedBy
      return `${identifiedBy.type}:${identifiedBy.identifier}`
    }

    throw new Error('Transaction failed!')
  }

  walletGetCallsStatus = async (data: any) => {
    if (!data.params || !data.params.length) {
      throw ethErrors.rpc.invalidParams('params is required but got []')
    }

    const id = data.params[0]
    if (!id) throw ethErrors.rpc.invalidParams('no identifier passed')

    const splitInTwo = id.split(':')
    if (splitInTwo.length !== 2) throw ethErrors.rpc.invalidParams('invalid identifier passed')

    const type = splitInTwo[0]
    const identifier = splitInTwo[1]
    const identifiedBy: AccountOpIdentifiedBy = {
      type,
      identifier
    }

    const dappNetwork = this.getDappNetwork(data.session.origin)
    const network = this.mainCtrl.networks.networks.filter((net) => net.id === dappNetwork.id)[0]
    const txnIdData = await fetchTxnId(
      identifiedBy,
      network,
      this.mainCtrl.fetch,
      this.mainCtrl.callRelayer
    )
    if (txnIdData.status !== 'success') {
      return {
        status: 'PENDING'
      }
    }

    const txnId = txnIdData.txnId as string
    const provider = getRpcProvider(network.rpcUrls, network.chainId, network.selectedRpcUrl)
    const receipt = await provider.getTransactionReceipt(txnId)
    if (!receipt) {
      return {
        status: 'PENDING'
      }
    }

    return {
      status: 'CONFIRMED',
      receipts: [receipt]
    }
  }

  walletShowCallsStatus = async (data: any) => {
    // TODO: open a modal with information about the transaction
  }

  @Reflect.metadata('ACTION_REQUEST', [
    'AddChain',
    ({ request, mainCtrl }: { request: ProviderRequest; mainCtrl: MainController }) => {
      const { params, session } = request
      if (!params[0]) {
        throw ethErrors.rpc.invalidParams('params is required but got []')
      }
      if (!params[0]?.chainId) {
        throw ethErrors.rpc.invalidParams('chainId is required')
      }
      const dapp = mainCtrl.dapps.getDapp(session.origin)
      const { chainId } = params[0]
      const network = mainCtrl.networks.networks.find(
        (n: any) => Number(n.chainId) === Number(chainId)
      )
      if (!dapp?.isConnected) return false

      if (!network) {
        throw ethErrors.provider.custom({
          code: 4902,
          message:
            'Unrecognized chain ID. Try adding the chain using wallet_addEthereumChain first.'
        })
      }
      return true
    }
  ])
  walletSwitchEthereumChain = ({
    params: [chainParams],
    session: { origin, name }
  }: ProviderRequest) => {
    let chainId = chainParams.chainId
    if (typeof chainId === 'string') {
      chainId = Number(chainId)
    }
    const network = this.mainCtrl.networks.networks.find((n) => Number(n.chainId) === chainId)

    if (!network) {
      throw new Error('This chain is not supported by Ambire yet.')
    }

    this.mainCtrl.dapps.updateDapp(origin, { chainId })
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      await notificationManager.create({
        title: 'Successfully switched network',
        message: `Network switched to ${network.name} for ${name || origin}.`
      })
    })()
    this.mainCtrl.dapps.broadcastDappSessionEvent(
      'chainChanged',
      {
        chain: `0x${network.chainId.toString(16)}`,
        networkVersion: `${network.chainId}`
      },
      origin
    )

    return null
  }

  @Reflect.metadata('ACTION_REQUEST', ['WalletWatchAsset', false])
  walletWatchAsset = () => true

  @Reflect.metadata('ACTION_REQUEST', ['GetEncryptionPublicKey', false])
  ethGetEncryptionPublicKey = ({ requestRes }: ProviderRequest) => ({
    result: requestRes
  })

  walletRequestPermissions = ({ params: permissions }: DappProviderRequest) => {
    const result: Web3WalletPermission[] = []
    if (permissions && 'eth_accounts' in permissions[0]) {
      result.push({ parentCapability: 'eth_accounts' })
    }
    return result
  }

  @Reflect.metadata('SAFE', true)
  walletGetPermissions = ({ session: { origin } }: DappProviderRequest) => {
    const result: Web3WalletPermission[] = []
    if (this.mainCtrl.dapps.getDapp(origin) && this.isUnlocked) {
      result.push({ parentCapability: 'eth_accounts' })
    }
    return result
  }

  personalEcRecover = ({ params: [data, sig, extra = {}] }: DappProviderRequest) => {
    // TODO:
  }

  @Reflect.metadata('SAFE', true)
  netListening = () => {
    return true
  }
}

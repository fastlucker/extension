/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata'

import { ethErrors } from 'eth-rpc-errors'
import { toBeHex } from 'ethers'
import cloneDeep from 'lodash/cloneDeep'

import { ORIGINS_WHITELISTED_TO_ALL_ACCOUNTS } from '@ambire-common/consts/dappCommunication'
import { MainController } from '@ambire-common/controllers/main/main'
import { DappProviderRequest } from '@ambire-common/interfaces/dapp'
import { SignUserRequest } from '@ambire-common/interfaces/userRequest'
import { AccountOpIdentifiedBy, fetchTxnId } from '@ambire-common/libs/accountOp/submittedAccountOp'
import bundler from '@ambire-common/services/bundlers'
import { getRpcProvider } from '@ambire-common/services/provider'
import { getBenzinUrlParams } from '@ambire-common/utils/benzin'
import { APP_VERSION, isProd } from '@common/config/env'
import formatDecimals from '@common/utils/formatDecimals'
import { SAFE_RPC_METHODS } from '@web/constants/common'
import { notificationManager } from '@web/extension-services/background/webapi/notification'

import { createTab } from '../webapi/tab'
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
    if (ORIGINS_WHITELISTED_TO_ALL_ACCOUNTS.includes(origin)) {
      const allOtherAccountAddresses = this.mainCtrl.accounts.accounts.reduce((prevValue, acc) => {
        if (acc.addr !== this.mainCtrl.selectedAccount.account?.addr) {
          prevValue.push(acc.addr)
        }

        return prevValue
      }, [] as string[])

      // Selected account goes first in the list
      return [this.mainCtrl.selectedAccount.account?.addr, ...allOtherAccountAddresses]
    }

    return this.mainCtrl.selectedAccount.account?.addr
      ? [this.mainCtrl.selectedAccount.account?.addr]
      : []
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
    if (
      !this.mainCtrl.dapps.hasPermission(origin) ||
      !this.isUnlocked ||
      !this.mainCtrl.selectedAccount.account ||
      !this.mainCtrl.selectedAccount.portfolio
    ) {
      return null
    }

    return {
      amount: this.mainCtrl.selectedAccount.portfolio.totalBalance,
      amountFormatted: formatDecimals(
        this.mainCtrl.selectedAccount.portfolio.totalBalance,
        'price'
      ),
      isReady: this.mainCtrl.selectedAccount.portfolio.isAllReady
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

    return this.mainCtrl.selectedAccount.account?.addr || null
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
        },
        auxiliaryFunds: {
          supported: !this.mainCtrl.accounts.accountStates[accountAddr][network.id].isEOA
        },
        paymasterService: {
          supported:
            !this.mainCtrl.accounts.accountStates[accountAddr][network.id].isEOA &&
            // enabled: obvious, it means we're operaring with 4337
            // hasBundlerSupport means it might not be 4337 but we support it
            // our default may be the relayer but we will broadcast an userOp
            // in case of sponsorships
            (network.erc4337.enabled || network.erc4337.hasBundlerSupport)
        }
      }
    })
    return capabilities
  }

  @Reflect.metadata('ACTION_REQUEST', ['SendTransaction', false])
  walletSendCalls = async (data: any) => {
    if (data.requestRes && data.requestRes.hash) {
      return data.requestRes.hash
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
    if (txnIdData.status === 'rejected') {
      return {
        status: 'FAILURE'
      }
    }
    if (txnIdData.status !== 'success') {
      return {
        status: 'PENDING'
      }
    }

    const txnId = txnIdData.txnId as string
    const provider = getRpcProvider(network.rpcUrls, network.chainId, network.selectedRpcUrl)
    const isUserOp = identifiedBy.type === 'UserOperation'
    const receipt = isUserOp
      ? await bundler.getReceipt(identifiedBy.identifier, network)
      : await provider.getTransactionReceipt(txnId)

    if (!receipt) {
      return {
        status: 'PENDING'
      }
    }

    return {
      status: 'CONFIRMED',
      receipts: [
        {
          logs: receipt.logs,
          status: isUserOp ? receipt.receipt.status : toBeHex(receipt.status as number),
          chainId: toBeHex(network.chainId),
          blockHash: isUserOp ? receipt.receipt.blockHash : receipt.blockHash,
          blockNumber: isUserOp
            ? receipt.receipt.blockNumber
            : toBeHex(receipt.blockNumber as number),
          gasUsed: isUserOp ? receipt.receipt.gasUsed : toBeHex(receipt.gasUsed),
          transactionHash: isUserOp ? receipt.receipt.transactionHash : receipt.hash
        }
      ]
    }
  }

  // open benzina in a separate tab upon a dapp request
  walletShowCallsStatus = async (data: any) => {
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
    const chainId = Number(network.chainId)

    const link = `https://benzin.ambire.com/${getBenzinUrlParams({
      txnId: null,
      chainId,
      identifiedBy
    })}`

    await createTab(link)
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

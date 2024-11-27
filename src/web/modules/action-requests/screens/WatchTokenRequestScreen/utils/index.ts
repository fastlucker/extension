import { ZeroAddress } from 'ethers'

import { Network } from '@ambire-common/interfaces/network'
import { RPCProviders } from '@ambire-common/interfaces/provider'
import { SelectedAccountPortfolio } from '@ambire-common/interfaces/selectedAccount'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import { TemporaryTokens } from '@ambire-common/libs/portfolio/interfaces'
import { TokenData } from '@web/modules/action-requests/screens/WatchTokenRequestScreen/WatchTokenRequestScreen' // Polygon MATIC token address

const selectNetwork = async (
  network: Network | undefined,
  tokenNetwork: Network | undefined,
  tokenData: TokenData,
  networks: Network[],
  validTokens: any,
  setIsLoading: (isLoading: boolean) => void,
  setTokenNetwork: (network: Network) => void,
  handleTokenType: (networkId: string) => void,
  providers: RPCProviders
) => {
  if (!network && !tokenNetwork?.id) {
    const validTokenNetworks = networks.filter(
      (_network: Network) =>
        validTokens.erc20[`${tokenData?.address}-${_network.id}`] === true &&
        `${tokenData?.address}-${_network.id}` in validTokens.erc20
    )
    const allNetworksChecked = networks.every(
      (_network: Network) =>
        `${tokenData?.address}-${_network.id}` in validTokens.erc20 &&
        providers[_network.id].isWorking
    )

    if (validTokenNetworks.length > 0) {
      const newTokenNetwork = validTokenNetworks.find(
        (_network: Network) => _network.id !== tokenNetwork?.id
      )
      if (newTokenNetwork) {
        setTokenNetwork(newTokenNetwork)
      }
    } else if (allNetworksChecked && validTokenNetworks.length === 0) {
      setIsLoading(false)
    } else {
      await Promise.all(
        networks.map(
          (_network: Network) => providers[_network.id].isWorking && handleTokenType(_network.id)
        )
      )
    }
  }
}

const getTokenEligibility = (
  tokenData: { address: string } | CustomToken,
  validTokens: any,
  tokenNetwork: Network | undefined
) =>
  null ||
  (tokenData?.address &&
    tokenNetwork?.id &&
    validTokens?.erc20[`${tokenData?.address}-${tokenNetwork?.id}`])

const getTokenFromPreferences = (
  tokenData: { address: string } | CustomToken,
  tokenNetwork: Network | undefined,
  tokenPreferences: CustomToken[]
) =>
  tokenData &&
  tokenPreferences?.find(
    (token: CustomToken) =>
      token.address.toLowerCase() === tokenData?.address.toLowerCase() &&
      token.networkId === tokenNetwork?.id
  )

const handleTokenIsInPortfolio = async (
  tokenInPreferences: CustomToken | undefined,
  accountPortfolio: SelectedAccountPortfolio | null,
  tokenNetwork: Network,
  tokenData: { address: string } | CustomToken
) => {
  const isTokenInHints =
    tokenInPreferences ||
    accountPortfolio?.tokens.find(
      (_t) =>
        _t.address.toLowerCase() === tokenData?.address.toLowerCase() &&
        _t.networkId === tokenNetwork?.id &&
        _t.amount > 0n
    )

  const isNative = tokenData?.address === ZeroAddress

  return isTokenInHints || tokenInPreferences || isNative
}

const getTokenFromPortfolio = (
  tokenData: { address: string } | CustomToken,
  tokenNetwork: Network | undefined,
  accountPortfolio: SelectedAccountPortfolio | null,
  tokenInPreferences: CustomToken | undefined
) =>
  (tokenData &&
    accountPortfolio?.tokens?.find(
      (token) =>
        token.address.toLowerCase() === tokenData?.address.toLowerCase() &&
        token.networkId === tokenNetwork?.id
    )) ||
  tokenInPreferences

const getTokenFromTemporaryTokens = (
  temporaryTokens: TemporaryTokens,
  tokenData: { address: string } | CustomToken,
  tokenNetwork: Network | undefined
) =>
  undefined ||
  (tokenData &&
    tokenNetwork &&
    temporaryTokens?.[tokenNetwork.id] &&
    temporaryTokens?.[tokenNetwork.id]?.result?.tokens?.find(
      (x) => x.address.toLowerCase() === tokenData.address.toLowerCase()
    ))

export {
  selectNetwork,
  handleTokenIsInPortfolio,
  getTokenEligibility,
  getTokenFromPreferences,
  getTokenFromTemporaryTokens,
  getTokenFromPortfolio
}

import { ZeroAddress } from 'ethers'

import { PortfolioController } from '@ambire-common/controllers/portfolio/portfolio'
import { NetworkDescriptor } from '@ambire-common/interfaces/networkDescriptor'
import { CustomToken } from '@ambire-common/libs/portfolio/customToken'
import { AccountPortfolio } from '@web/contexts/portfolioControllerStateContext'
import { TokenData } from '@web/modules/notification-requests/screens/WatchTokenRequestScreen/WatchTokenRequestScreen' // Polygon MATIC token address

const polygonMaticTokenAddress = '0x0000000000000000000000000000000000001010'

const selectNetwork = async (
  network: NetworkDescriptor | undefined,
  tokenNetwork: NetworkDescriptor | undefined,
  tokenData: TokenData,
  networks: NetworkDescriptor[],
  portfolio: { state: PortfolioController },
  setIsLoading: (isLoading: boolean) => void,
  setTokenNetwork: (network: NetworkDescriptor) => void,
  handleTokenType: (networkId: string) => void
) => {
  if (!network && !tokenNetwork?.id) {
    const checkedNetworks = Object.keys(portfolio.state.validTokens.erc20)
      .filter(key => key.startsWith(`${tokenData?.address}-`))
      .map(key => key.split('-')[1]);
    const uncheckedNetworks = networks.filter(_network =>
        !checkedNetworks.includes(_network.id)
      );

    const validTokenNetworks = networks.filter(
      (_network: NetworkDescriptor) =>
        portfolio.state.validTokens.erc20[`${tokenData?.address}-${_network.id}`] === true &&
        `${tokenData?.address}-${_network.id}` in portfolio.state.validTokens.erc20
    )
    const allNetworksChecked = networks.every(
      (_network: NetworkDescriptor) =>
        `${tokenData?.address}-${_network.id}` in portfolio.state.validTokens.erc20
    )
  
    
    if (validTokenNetworks.length > 0) {
      const newTokenNetwork = validTokenNetworks.find(
        (_network: NetworkDescriptor) => _network.id !== tokenNetwork?.id
      )
      if (newTokenNetwork) {
        setTokenNetwork(newTokenNetwork)
      }
    } else if (allNetworksChecked && validTokenNetworks.length === 0) {
      setIsLoading(false)
    }  else {
      await Promise.all(uncheckedNetworks.map((_network: NetworkDescriptor) => handleTokenType(_network.id)))
    }
  }
}

const getTokenEligibility = (
  tokenData: { address: string } | CustomToken,
  portfolio: { state: PortfolioController },
  tokenNetwork: NetworkDescriptor | undefined
) => null ||
    (tokenData &&
      tokenNetwork?.id &&
      portfolio.state.validTokens.erc20[`${tokenData?.address}-${tokenNetwork?.id}`])
  


const getTokenFromPreferences = (
  tokenData: { address: string } | CustomToken,
  tokenNetwork: NetworkDescriptor | undefined,
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
  accountPortfolio: AccountPortfolio | null,
  tokenNetwork: NetworkDescriptor,
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

  const isNative =
    tokenData?.address === ZeroAddress ||
    (tokenNetwork?.id === 'polygon' && tokenData?.address === polygonMaticTokenAddress)

  return isTokenInHints || tokenInPreferences || isNative
}

const getTokenFromPortfolio = (
  tokenData: { address: string } | CustomToken,
  tokenNetwork: NetworkDescriptor | undefined,
  accountPortfolio: AccountPortfolio | null,
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
  portfolio: any,
  tokenData: { address: string } | CustomToken,
  tokenNetwork: NetworkDescriptor | undefined
) =>
  undefined ||
  (tokenData &&
    tokenNetwork &&
    portfolio.state.temporaryTokens[tokenNetwork.id] &&
    portfolio.state.temporaryTokens[tokenNetwork.id]?.result?.tokens?.find(
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

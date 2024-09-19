import { useCallback, useMemo, useState } from 'react'

import { TokenResult } from '@ambire-common/libs/portfolio'
import { getTokenAmount } from '@ambire-common/libs/portfolio/helpers'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import useGetTokenSelectProps from '@web/modules/swap-and-bridge/hooks/useGetTokenSelectProps'
import { getTokenId } from '@web/utils/token'

const useSwapAndBridgeFrom = () => {
  const { fromAmount, fromSelectedToken } = useSwapAndBridgeControllerState()
  const [fromAmountValue, setFromAmountValue] = useState<string>(fromAmount)
  const { dispatch } = useBackgroundService()
  const { networks } = useNetworksControllerState()
  const { accountPortfolio } = usePortfolioControllerState()

  const onFromAmountChange = useCallback(
    (value: string) => {
      setFromAmountValue(value)
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE',
        params: { fromAmount: value }
      })
    },
    [dispatch]
  )

  const fromTokenList = useMemo(
    () =>
      accountPortfolio?.tokens.filter((token) => {
        const hasAmount = Number(getTokenAmount(token)) > 0

        return hasAmount && !token.flags.onGasTank && !token.flags.rewardsType
      }) || [],
    [accountPortfolio?.tokens]
  )

  const {
    options: fromTokenOptions,
    value: fromTokenValue,
    amountSelectDisabled: fromTokenAmountSelectDisabled
  } = useGetTokenSelectProps({
    tokens: fromTokenList,
    token: fromSelectedToken ? getTokenId(fromSelectedToken) : '',
    networks
  })

  const handleChangeFromToken = useCallback(
    (value: string) => {
      const tokenToSelect = fromTokenList.find(
        (tokenRes: TokenResult) => getTokenId(tokenRes) === value
      )

      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE',
        params: { fromSelectedToken: tokenToSelect }
      })
    },
    [dispatch, fromTokenList]
  )

  return {
    fromAmountValue,
    onFromAmountChange,
    fromTokenAmountSelectDisabled,
    fromTokenOptions,
    fromTokenValue,
    handleChangeFromToken
  }
}

export default useSwapAndBridgeFrom

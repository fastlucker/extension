import React, { FC, memo, useCallback } from 'react'

import { TokenResult } from '@ambire-common/libs/portfolio'
import { SelectValue } from '@common/components/Select/types'
import SendToken from '@common/components/SendToken'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import useSwapAndBridgeForm from '@web/modules/swap-and-bridge/hooks/useSwapAndBridgeForm'
import { getTokenId } from '@web/utils/token'

type Props = Pick<
  ReturnType<typeof useSwapAndBridgeForm>,
  | 'fromTokenOptions'
  | 'fromTokenValue'
  | 'fromAmountValue'
  | 'fromTokenAmountSelectDisabled'
  | 'onFromAmountChange'
  | 'setIsAutoSelectRouteDisabled'
>

const FromToken: FC<Props> = ({
  fromTokenOptions,
  fromTokenValue,
  fromAmountValue,
  fromTokenAmountSelectDisabled,
  setIsAutoSelectRouteDisabled,
  onFromAmountChange
}) => {
  const { networks } = useNetworksControllerState()
  const { dispatch } = useBackgroundService()

  const {
    fromSelectedToken,
    fromAmount,
    fromAmountInFiat,
    maxFromAmountInFiat,
    portfolioTokenList,
    fromAmountFieldMode,
    maxFromAmount,
    validateFromAmount
  } = useSwapAndBridgeControllerState()

  const handleChangeFromToken = useCallback(
    ({ value }: SelectValue) => {
      const tokenToSelect = portfolioTokenList.find(
        (tokenRes: TokenResult) => getTokenId(tokenRes, networks) === value
      )

      setIsAutoSelectRouteDisabled(false)

      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
        params: { fromSelectedToken: tokenToSelect }
      })
    },
    [portfolioTokenList, setIsAutoSelectRouteDisabled, dispatch, networks]
  )

  const handleSetMaxFromAmount = useCallback(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
      params: { fromAmount: fromAmountFieldMode === 'token' ? maxFromAmount : maxFromAmountInFiat }
    })
  }, [fromAmountFieldMode, maxFromAmount, maxFromAmountInFiat, dispatch])

  const handleSwitchFromAmountFieldMode = useCallback(() => {
    dispatch({
      type: 'SWAP_AND_BRIDGE_CONTROLLER_UPDATE_FORM',
      params: { fromAmountFieldMode: fromAmountFieldMode === 'token' ? 'fiat' : 'token' }
    })
  }, [fromAmountFieldMode, dispatch])

  return (
    <SendToken
      fromTokenOptions={fromTokenOptions}
      fromTokenValue={fromTokenValue}
      fromAmountValue={fromAmountValue}
      fromTokenAmountSelectDisabled={fromTokenAmountSelectDisabled}
      handleChangeFromToken={handleChangeFromToken}
      fromSelectedToken={fromSelectedToken}
      fromAmount={fromAmount}
      fromAmountInFiat={fromAmountInFiat}
      fromAmountFieldMode={fromAmountFieldMode}
      maxFromAmount={maxFromAmount}
      validateFromAmount={validateFromAmount}
      onFromAmountChange={onFromAmountChange}
      handleSwitchFromAmountFieldMode={handleSwitchFromAmountFieldMode}
      handleSetMaxFromAmount={handleSetMaxFromAmount}
      inputTestId="from-amount-input-sab"
      selectTestId="from-token-select"
    />
  )
}

export default memo(FromToken)

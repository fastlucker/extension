import React, { FC, memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { TokenResult } from '@ambire-common/libs/portfolio'
import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import FlipIcon from '@common/assets/svg/FlipIcon'
import NumberInput from '@common/components/NumberInput'
import Select from '@common/components/Select'
import { SelectValue } from '@common/components/Select/types'
import Text from '@common/components/Text'
import { FONT_FAMILIES } from '@common/hooks/useFonts'
import useTheme from '@common/hooks/useTheme'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNetworksControllerState from '@web/hooks/useNetworksControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import MaxAmount from '@web/modules/swap-and-bridge/components/MaxAmount'
import useSwapAndBridgeForm from '@web/modules/swap-and-bridge/hooks/useSwapAndBridgeForm'
import getStyles from '@web/modules/swap-and-bridge/styles/swapAndBridgeCommonStyles'
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
  const { portfolio } = useSelectedAccountControllerState()
  const { networks } = useNetworksControllerState()
  const { dispatch } = useBackgroundService()
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()

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

  const dollarIcon = useCallback(() => {
    if (fromAmountFieldMode === 'token') return null

    return (
      <Text
        fontSize={20}
        weight="medium"
        style={{ marginBottom: 3 }}
        appearance={fromAmountInFiat ? 'primaryText' : 'secondaryText'}
      >
        $
      </Text>
    )
  }, [fromAmountFieldMode, fromAmountInFiat])
  return (
    <View style={spacings.mbXl}>
      <Text appearance="secondaryText" fontSize={16} weight="medium" style={spacings.mbTy}>
        {t('Send')}
      </Text>
      <View
        style={[
          styles.secondaryContainer,
          spacings.pr2Xl,
          !!validateFromAmount.message && styles.secondaryContainerWarning
        ]}
      >
        <View style={[flexbox.flex1, flexbox.directionRow, flexbox.alignCenter]}>
          <Select
            setValue={handleChangeFromToken}
            options={fromTokenOptions}
            value={fromTokenValue}
            testID="from-token-select"
            searchPlaceholder={t('Token name or address...')}
            emptyListPlaceholderText={t('No tokens found.')}
            containerStyle={{ ...flexbox.flex1, ...spacings.mb0 }}
            // menuLeftHorizontalOffset={285}
            selectStyle={{
              backgroundColor: '#54597A14',
              borderWidth: 0
            }}
          />
          <NumberInput
            value={fromAmountValue}
            onChangeText={onFromAmountChange}
            placeholder="0"
            borderless
            inputWrapperStyle={{ backgroundColor: 'transparent' }}
            nativeInputStyle={{
              fontFamily: FONT_FAMILIES.MEDIUM,
              fontSize: 20,
              textAlign: 'right'
            }}
            disabled={fromTokenAmountSelectDisabled}
            containerStyle={[spacings.mb0, flexbox.flex1]}
            leftIcon={dollarIcon}
            leftIconStyle={spacings.plXl}
            inputStyle={spacings.ph0}
            error={validateFromAmount.message || ''}
            errorType="warning"
            testID="from-amount-input-sab"
          />
        </View>
        <View
          style={[
            flexbox.directionRow,
            flexbox.alignCenter,
            flexbox.justifySpaceBetween,
            spacings.ptSm
          ]}
        >
          {!fromTokenAmountSelectDisabled && (
            <MaxAmount
              isLoading={!portfolio?.isReadyToVisualize}
              maxAmount={Number(maxFromAmount)}
              selectedTokenSymbol={fromSelectedToken?.symbol || ''}
              onMaxButtonPress={handleSetMaxFromAmount}
            />
          )}
          {fromSelectedToken?.priceIn.length !== 0 ? (
            <>
              <Pressable
                onPress={handleSwitchFromAmountFieldMode}
                style={[
                  flexbox.directionRow,
                  flexbox.alignCenter,
                  flexbox.alignSelfStart,
                  {
                    position: 'absolute',
                    right: -32,
                    top: -8
                  }
                ]}
                disabled={fromTokenAmountSelectDisabled}
              >
                {({ hovered }: any) => (
                  <View
                    style={{
                      backgroundColor: hovered ? '#6000FF14' : theme.infoBackground,
                      borderRadius: 50,
                      paddingHorizontal: 5,
                      paddingVertical: 5,
                      ...spacings.mrTy
                    }}
                  >
                    <FlipIcon width={11} height={11} color={theme.primary} />
                  </View>
                )}
              </Pressable>
              <Text fontSize={12} appearance="primary" weight="medium" testID="switch-currency-sab">
                {fromAmountFieldMode === 'token'
                  ? `${
                      fromAmountInFiat ? formatDecimals(parseFloat(fromAmountInFiat), 'value') : 0
                    }`
                  : `${fromAmount ? formatDecimals(parseFloat(fromAmount), 'amount') : 0} ${
                      fromSelectedToken?.symbol
                    }`}
              </Text>
            </>
          ) : (
            <View />
          )}
        </View>
      </View>
    </View>
  )
}

export default memo(FromToken)

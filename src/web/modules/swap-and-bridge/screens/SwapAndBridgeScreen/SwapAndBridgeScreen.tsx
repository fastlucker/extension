import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import FlipIcon from '@common/assets/svg/FlipIcon'
import SwapBridgeToggleIcon from '@common/assets/svg/SwapBridgeToggleIcon'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import NumberInput from '@common/components/NumberInput'
import Panel from '@common/components/Panel'
import Select from '@common/components/Select'
import Text from '@common/components/Text'
import { FONT_FAMILIES } from '@common/hooks/useFonts'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import formatDecimals from '@common/utils/formatDecimals'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import useSwapAndBridgeFrom from '@web/modules/swap-and-bridge/hooks/useSwapAndBridgeForm'

import MaxAmount from '../../components/MaxAmount/MaxAmount'
import RouteStepsPlaceholder from '../../components/RouteStepsPlaceholder'
import RouteStepsPreview from '../../components/RouteStepsPreview'
import getStyles from './styles'

const SwapAndBridgeScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const {
    fromAmountValue,
    onFromAmountChange,
    fromTokenOptions,
    fromTokenValue,
    fromTokenAmountSelectDisabled,
    handleChangeFromToken,
    toNetworksOptions,
    handleSetToNetworkValue,
    toTokenOptions,
    toTokenValue,
    handleChangeToToken,
    handleSwitchFromAmountFieldMode,
    handleSetMaxFromAmount,
    handleSubmitForm,
    formattedToAmount
  } = useSwapAndBridgeFrom()
  const {
    fromSelectedToken,
    fromAmount,
    fromAmountInFiat,
    fromAmountFieldMode,
    toChainId,
    toSelectedToken,
    maxFromAmount,
    maxFromAmountInFiat,
    quote,
    formStatus,
    validateFromAmount
  } = useSwapAndBridgeControllerState()
  const { accountPortfolio } = usePortfolioControllerState()

  const handleBackButtonPress = useCallback(() => {
    navigate(ROUTES.dashboard)
  }, [navigate])

  // TODO: Disable tokens that are NOT supported
  // (not in the `fromTokenList` of the SwapAndBridge controller)

  // TODO: Confirmation modal (warn) if the diff in dollar amount between the
  // FROM and TO tokens is too high (therefore, user will lose money).

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
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={<HeaderAccountAndNetworkInfo />}
      footer={<BackButton onPress={handleBackButtonPress} />}
    >
      <TabLayoutWrapperMainContent
        contentContainerStyle={{ ...spacings.ptMd, ...flexbox.alignCenter }}
      >
        <View style={styles.container}>
          <Panel title={t('Swap & Bridge')} forceContainerSmallSpacings>
            <View>
              <Text appearance="secondaryText" fontSize={14} weight="medium" style={spacings.mbMi}>
                {t('Send')}
              </Text>
              <View
                style={[
                  styles.secondaryContainer,
                  !!validateFromAmount.message && styles.secondaryContainerWarning
                ]}
              >
                <View style={flexbox.directionRow}>
                  <View style={flexbox.flex1}>
                    <NumberInput
                      value={fromAmountValue}
                      onChangeText={onFromAmountChange}
                      placeholder="0"
                      borderless
                      inputWrapperStyle={{ backgroundColor: 'transparent' }}
                      nativeInputStyle={{ fontFamily: FONT_FAMILIES.MEDIUM, fontSize: 20 }}
                      disabled={fromTokenAmountSelectDisabled}
                      containerStyle={spacings.mb0}
                      leftIcon={dollarIcon}
                      leftIconStyle={spacings.pl0}
                      inputStyle={spacings.pl0}
                      error={validateFromAmount.message || ''}
                      errorType="warning"
                    />
                  </View>
                  <Select
                    setValue={({ value }) => handleChangeFromToken(value as string)}
                    options={fromTokenOptions}
                    value={fromTokenValue}
                    // disabled={disableForm}
                    testID="from-token-select"
                    containerStyle={{ ...flexbox.flex1, ...spacings.mb0 }}
                    selectStyle={{ backgroundColor: '#54597A14', borderWidth: 0 }}
                  />
                </View>
                <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.ptSm]}>
                  <View style={flexbox.flex1}>
                    {fromSelectedToken?.priceIn.length !== 0 ? (
                      <Pressable
                        onPress={handleSwitchFromAmountFieldMode}
                        style={[flexbox.directionRow, flexbox.alignCenter]}
                        disabled={fromTokenAmountSelectDisabled}
                      >
                        <View
                          style={{
                            backgroundColor: theme.infoBackground,
                            borderRadius: 50,
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                            ...spacings.mrTy
                          }}
                        >
                          <FlipIcon width={11} height={11} color={theme.primary} />
                        </View>
                        <Text fontSize={12} appearance="primary" weight="medium">
                          {fromAmountFieldMode === 'token'
                            ? `≈ ${
                                fromAmountInFiat
                                  ? formatDecimals(Number(fromAmountInFiat), 'value')
                                  : 0
                              } USD`
                            : `${fromAmount ? formatDecimals(Number(fromAmount), 'amount') : 0} ${
                                fromSelectedToken?.symbol
                              }`}
                        </Text>
                      </Pressable>
                    ) : (
                      <View />
                    )}
                  </View>
                  {!fromTokenAmountSelectDisabled && (
                    <MaxAmount
                      isLoading={!accountPortfolio?.isAllReady}
                      maxAmount={Number(maxFromAmount)}
                      maxAmountInFiat={Number(maxFromAmountInFiat)}
                      selectedTokenSymbol={fromSelectedToken?.symbol || ''}
                      onMaxButtonPress={handleSetMaxFromAmount}
                    />
                  )}
                </View>
              </View>
            </View>
          </Panel>
          <View style={styles.swapAndBridgeToggleButtonWrapper}>
            <Pressable style={styles.swapAndBridgeToggleButton}>
              <SwapBridgeToggleIcon />
            </Pressable>
          </View>
          <Panel forceContainerSmallSpacings>
            <View style={spacings.mb}>
              <Text appearance="secondaryText" fontSize={14} weight="medium" style={spacings.mbMi}>
                {t('Receive')}
              </Text>
              <View style={styles.secondaryContainer}>
                <View style={[flexbox.directionRow, spacings.mb]}>
                  <Select
                    setValue={handleSetToNetworkValue}
                    containerStyle={{ ...spacings.mb0, ...flexbox.flex1 }}
                    options={toNetworksOptions}
                    value={toNetworksOptions.filter((opt) => opt.value === toChainId)[0]}
                    selectStyle={{ backgroundColor: '#54597A14', borderWidth: 0 }}
                  />
                  <Select
                    setValue={({ value }) => handleChangeToToken(value as string)}
                    options={toTokenOptions}
                    value={toTokenValue}
                    // disabled={disableForm}
                    testID="to-token-select"
                    containerStyle={{ ...spacings.mb0, ...flexbox.flex1 }}
                    selectStyle={{ backgroundColor: '#54597A14', borderWidth: 0 }}
                  />
                </View>

                <Text
                  fontSize={20}
                  weight="medium"
                  numberOfLines={1}
                  appearance={
                    formattedToAmount && formattedToAmount !== '0' ? 'primaryText' : 'secondaryText'
                  }
                >
                  {formattedToAmount}
                  {!!formattedToAmount && formattedToAmount !== '0' && !!quote?.route && (
                    <Text fontSize={20} appearance="secondaryText">{` (${formatDecimals(
                      quote.route.outputValueInUsd,
                      'price'
                    )})`}</Text>
                  )}
                </Text>
              </View>
            </View>

            {[
              SwapAndBridgeFormStatus.FetchingRoutes,
              SwapAndBridgeFormStatus.NoRoutesFound,
              SwapAndBridgeFormStatus.ReadyToSubmit
            ].includes(formStatus) && (
              <View>
                <Text
                  appearance="secondaryText"
                  fontSize={14}
                  weight="medium"
                  style={spacings.mbMi}
                >
                  {t('Preview route')}
                </Text>
              </View>
            )}

            {formStatus === SwapAndBridgeFormStatus.FetchingRoutes && (
              <View style={styles.secondaryContainer}>
                <RouteStepsPlaceholder
                  fromSelectedToken={fromSelectedToken!}
                  toSelectedToken={toSelectedToken!}
                  withBadge="loading"
                />
              </View>
            )}
            {formStatus === SwapAndBridgeFormStatus.NoRoutesFound && (
              <View style={styles.secondaryContainer}>
                <RouteStepsPlaceholder
                  fromSelectedToken={fromSelectedToken!}
                  toSelectedToken={toSelectedToken!}
                  withBadge="no-route-found"
                />
              </View>
            )}
            {formStatus === SwapAndBridgeFormStatus.ReadyToSubmit && (
              <View style={styles.secondaryContainer}>
                <RouteStepsPreview
                  steps={quote!.routeSteps}
                  totalGasFeesInUsd={quote!.route.totalGasFeesInUsd}
                  estimationInSeconds={quote!.route.serviceTime}
                />
              </View>
            )}
          </Panel>
          <View style={spacings.ptTy}>
            <Button
              text={t('Proceed')}
              disabled={formStatus !== SwapAndBridgeFormStatus.ReadyToSubmit}
              onPress={handleSubmitForm}
            />
          </View>
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(SwapAndBridgeScreen)

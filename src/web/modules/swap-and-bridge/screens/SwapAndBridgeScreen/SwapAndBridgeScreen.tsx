import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable, View } from 'react-native'

import { EstimationStatus } from '@ambire-common/controllers/estimation/types'
import { SigningStatus } from '@ambire-common/controllers/signAccountOp/signAccountOp'
import { SwapAndBridgeFormStatus } from '@ambire-common/controllers/swapAndBridge/swapAndBridge'
import formatDecimals from '@ambire-common/utils/formatDecimals/formatDecimals'
import FlipIcon from '@common/assets/svg/FlipIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import WarningIcon from '@common/assets/svg/WarningIcon'
import Alert from '@common/components/Alert'
import BackButton from '@common/components/BackButton'
import Button from '@common/components/Button'
import Checkbox from '@common/components/Checkbox'
import NumberInput from '@common/components/NumberInput'
import Select from '@common/components/Select'
import Spinner from '@common/components/Spinner'
import Text from '@common/components/Text'
import { FONT_FAMILIES } from '@common/hooks/useFonts'
import useNavigation from '@common/hooks/useNavigation'
import usePrevious from '@common/hooks/usePrevious'
import useTheme from '@common/hooks/useTheme'
import useWindowSize from '@common/hooks/useWindowSize'
import Header from '@common/modules/header/components/Header'
import { ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import { TabLayoutContainer, TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper'
import { getTabLayoutPadding } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSelectedAccountControllerState from '@web/hooks/useSelectedAccountControllerState'
import useSwapAndBridgeControllerState from '@web/hooks/useSwapAndBridgeControllerState'
import Estimation from '@web/modules/sign-account-op/components/Estimation'
import ActiveRouteCard from '@web/modules/swap-and-bridge/components/ActiveRouteCard'
import MaxAmount from '@web/modules/swap-and-bridge/components/MaxAmount'
import RoutesModal from '@web/modules/swap-and-bridge/components/RoutesModal'
import SwitchTokensButton from '@web/modules/swap-and-bridge/components/SwitchTokensButton'
import ToTokenSelect from '@web/modules/swap-and-bridge/components/ToTokenSelect'
import useSwapAndBridgeForm from '@web/modules/swap-and-bridge/hooks/useSwapAndBridgeForm'
import { getUiType } from '@web/utils/uiType'

import getStyles from './styles'

const SWAP_AND_BRIDGE_HC_URL = 'https://help.ambire.com/hc/en-us/articles/16748050198428'

const { isPopup } = getUiType()

const SwapAndBridgeScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { maxWidthSize } = useWindowSize()
  const {
    sessionId,
    fromAmountValue,
    onFromAmountChange,
    fromTokenOptions,
    fromTokenValue,
    fromTokenAmountSelectDisabled,
    handleChangeFromToken,
    toNetworksOptions,
    getToNetworkSelectValue,
    handleSetToNetworkValue,
    toTokenOptions,
    toTokenValue,
    toTokenAmountSelectDisabled,
    handleAddToTokenByAddress,
    handleChangeToToken,
    handleSwitchFromAmountFieldMode,
    handleSetMaxFromAmount,
    handleSubmitForm,
    formattedToAmount,
    shouldConfirmFollowUpTransactions,
    followUpTransactionConfirmed,
    setFollowUpTransactionConfirmed,
    highPriceImpactInPercentage,
    highPriceImpactConfirmed,
    setHighPriceImpactConfirmed,
    handleSwitchFromAndToTokens,
    pendingRoutes,
    routesModalRef,
    openRoutesModal,
    closeRoutesModal
  } = useSwapAndBridgeForm()
  const {
    sessionIds,
    fromSelectedToken,
    fromAmount,
    fromAmountInFiat,
    fromAmountFieldMode,
    maxFromAmount,
    quote,
    formStatus,
    validateFromAmount,
    isSwitchFromAndToTokensEnabled,
    isHealthy,
    shouldEnableRoutesSelection,
    updateQuoteStatus,
    statuses: swapAndBridgeCtrlStatuses,
    signAccountOpController
  } = useSwapAndBridgeControllerState()
  const { statuses: mainCtrlStatuses } = useMainControllerState()
  const { portfolio } = useSelectedAccountControllerState()
  const prevPendingRoutes: any[] | undefined = usePrevious(pendingRoutes)
  const scrollViewRef: any = useRef(null)
  const { dispatch } = useBackgroundService()
  const isViewOnly = useMemo(
    () => signAccountOpController?.accountKeyStoreKeys.length === 0,
    [signAccountOpController?.accountKeyStoreKeys]
  )
  const hasEstimation = useMemo(
    () =>
      signAccountOpController?.isInitialized &&
      !!signAccountOpController?.gasPrices &&
      !signAccountOpController.estimation.error,
    [
      signAccountOpController?.estimation?.error,
      signAccountOpController?.gasPrices,
      signAccountOpController?.isInitialized
    ]
  )

  useEffect(() => {
    if (formStatus === SwapAndBridgeFormStatus.ReadyToEstimate && !signAccountOpController) {
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_INIT_SIGN_ACCOUNT_OP'
      })
    } else if (
      formStatus !== SwapAndBridgeFormStatus.ReadyToEstimate &&
      formStatus !== SwapAndBridgeFormStatus.ReadyToSubmit &&
      !!signAccountOpController
    ) {
      dispatch({
        type: 'SWAP_AND_BRIDGE_CONTROLLER_DESTROY_SIGN_ACCOUNT_OP'
      })
    }
  }, [formStatus, dispatch, signAccountOpController])

  useEffect(() => {
    if (signAccountOpController?.status?.type === SigningStatus.Done) {
      dispatch({
        type: 'MAIN_CONTROLLER_HANDLE_SIGN_AND_BROADCAST_ACCOUNT_OP',
        params: {
          isSwapAndBridge: true
        }
      })
    }
  }, [formStatus, dispatch, signAccountOpController?.status?.type])

  const handleBackButtonPress = useCallback(() => {
    navigate(ROUTES.dashboard)
  }, [navigate])

  useEffect(() => {
    if (!pendingRoutes || !prevPendingRoutes) return
    if (!pendingRoutes.length) return
    if (prevPendingRoutes.length < pendingRoutes.length) {
      // scroll to top when there is a new item in the active routes list
      scrollViewRef.current?.scrollTo({ y: 0 })
    }
  }, [pendingRoutes, prevPendingRoutes])

  // TODO: Disable tokens that are NOT supported
  // (not in the `fromTokenList` of the SwapAndBridge controller)

  // TODO: Confirmation modal (warn) if the diff in dollar amount between the
  // FROM and TO tokens is too high (therefore, user will lose money).

  const paddingHorizontalStyle = useMemo(() => getTabLayoutPadding(maxWidthSize), [maxWidthSize])

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

  const handleFollowUpTransactionConfirmedCheckboxPress = useCallback(() => {
    setFollowUpTransactionConfirmed((p) => !p)
  }, [setFollowUpTransactionConfirmed])

  const handleHighPriceImpactCheckboxPress = useCallback(() => {
    setHighPriceImpactConfirmed((p) => !p)
  }, [setHighPriceImpactConfirmed])

  const handleOpenReadMore = useCallback(() => Linking.openURL(SWAP_AND_BRIDGE_HC_URL), [])

  if (!sessionIds.includes(sessionId)) return null

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      // header={<HeaderAccountAndNetworkInfo withOG />}
      header={
        <Header
          displayBackButtonIn="popup"
          mode="title"
          customTitle={t('Swap & Bridge')}
          withAmbireLogo
          forceBack // TODO: this shouldn't be needed
        />
      }
      withHorizontalPadding={false}
      footer={!isPopup ? <BackButton onPress={handleBackButtonPress} /> : null}
    >
      <TabLayoutWrapperMainContent
        contentContainerStyle={{
          ...spacings.pt0,
          ...spacings.pb0,
          ...paddingHorizontalStyle,
          flexGrow: 1
        }}
        wrapperRef={scrollViewRef}
      >
        <View style={styles.container}>
          {isHealthy === false && (
            <Alert
              type="error"
              title={t('Temporarily unavailable.')}
              text={t(
                "We're currently unable to initiate a swap or bridge request because our service provider's API is temporarily unavailable. Please try again later. If the issue persists, check for updates or contact support."
              )}
              style={spacings.mb}
            />
          )}
          {!!pendingRoutes.length && (
            <View style={spacings.mbLg}>
              {pendingRoutes.map((activeRoute) => (
                <ActiveRouteCard key={activeRoute.activeRouteId} activeRoute={activeRoute} />
              ))}
            </View>
          )}

          <View
            style={[
              spacings.ph,
              spacings.pb,
              spacings.ptMd,
              spacings.mbXl,
              {
                borderRadius: 12,
                backgroundColor: theme.primaryBackground,
                shadowColor: theme.primaryBorder,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.3,
                shadowRadius: 24,
                elevation: 10 // for Android
              }
            ]}
          >
            <View style={spacings.mbXl}>
              <Text appearance="secondaryText" fontSize={16} weight="medium" style={spacings.mbTy}>
                {t('Send')}
              </Text>
              <View
                style={[
                  styles.secondaryContainer,
                  spacings.prLg,
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
                    leftIconStyle={spacings.pl0}
                    inputStyle={spacings.pr0}
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
                  <View>
                    {fromSelectedToken?.priceIn.length !== 0 ? (
                      <Pressable
                        onPress={handleSwitchFromAmountFieldMode}
                        style={[flexbox.directionRow, flexbox.alignCenter, flexbox.alignSelfStart]}
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
                        <Text
                          fontSize={12}
                          appearance="primary"
                          weight="medium"
                          testID="switch-currency-sab"
                        >
                          {fromAmountFieldMode === 'token'
                            ? `≈ ${
                                fromAmountInFiat
                                  ? formatDecimals(parseFloat(fromAmountInFiat), 'value')
                                  : 0
                              } USD`
                            : `${
                                fromAmount ? formatDecimals(parseFloat(fromAmount), 'amount') : 0
                              } ${fromSelectedToken?.symbol}`}
                        </Text>
                      </Pressable>
                    ) : (
                      <View />
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View style={spacings.mbTy}>
              <View
                style={[
                  flexbox.directionRow,
                  flexbox.alignCenter,
                  flexbox.justifySpaceBetween,
                  spacings.mbTy
                ]}
              >
                <SwitchTokensButton
                  onPress={handleSwitchFromAndToTokens}
                  disabled={!isSwitchFromAndToTokensEnabled}
                />
                <Text appearance="secondaryText" fontSize={16} weight="medium">
                  {t('Receive')}
                </Text>
                <Select
                  setValue={handleSetToNetworkValue}
                  containerStyle={{ ...spacings.mb0, width: 142 }}
                  options={toNetworksOptions}
                  size="sm"
                  value={getToNetworkSelectValue}
                  selectStyle={{
                    backgroundColor: '#54597A14',
                    borderWidth: 0
                  }}
                />
              </View>
              <View style={[styles.secondaryContainer, spacings.ph0]}>
                <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.phSm]}>
                  <ToTokenSelect
                    toTokenOptions={toTokenOptions}
                    toTokenValue={toTokenValue}
                    handleChangeToToken={handleChangeToToken}
                    toTokenAmountSelectDisabled={toTokenAmountSelectDisabled}
                    addToTokenByAddressStatus={swapAndBridgeCtrlStatuses.addToTokenByAddress}
                    handleAddToTokenByAddress={handleAddToTokenByAddress}
                  />
                  <View style={[flexbox.flex1]}>
                    <Text
                      fontSize={20}
                      weight="medium"
                      numberOfLines={1}
                      appearance={
                        formattedToAmount && formattedToAmount !== '0'
                          ? 'primaryText'
                          : 'secondaryText'
                      }
                      style={{ ...spacings.mr, textAlign: 'right' }}
                    >
                      {formattedToAmount}
                      {!!formattedToAmount &&
                        formattedToAmount !== '0' &&
                        !!quote?.selectedRoute && (
                          <Text fontSize={20} appearance="secondaryText">{` (${formatDecimals(
                            quote.selectedRoute.outputValueInUsd,
                            'price'
                          )})`}</Text>
                        )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {[
              SwapAndBridgeFormStatus.FetchingRoutes,
              SwapAndBridgeFormStatus.NoRoutesFound,
              SwapAndBridgeFormStatus.InvalidRouteSelected,
              SwapAndBridgeFormStatus.ReadyToEstimate,
              SwapAndBridgeFormStatus.ReadyToSubmit
            ].includes(formStatus) && (
              <View
                style={[
                  spacings.mtTy,
                  spacings.mbTy,
                  flexbox.directionRow,
                  flexbox.alignCenter,
                  flexbox.justifySpaceBetween,
                  flexbox.flex1
                ]}
              >
                {formStatus === SwapAndBridgeFormStatus.NoRoutesFound ? (
                  <View>
                    <WarningIcon width={14} height={14} color={theme.warningDecorative} />
                    <Text fontSize={14} weight="medium" appearance="warningText">
                      {t('No routes found.')}
                    </Text>
                  </View>
                ) : (
                  <View />
                )}

                <Pressable
                  style={{
                    ...styles.selectAnotherRouteButton,
                    opacity: shouldEnableRoutesSelection ? 1 : 0.5
                  }}
                  onPress={openRoutesModal as any}
                  disabled={!shouldEnableRoutesSelection}
                >
                  <Text fontSize={12} weight="medium" appearance="primary" style={spacings.mrTy}>
                    {t('Select route')}
                  </Text>
                  <RightArrowIcon color={theme.primary} />
                </Pressable>
              </View>
            )}

            {(formStatus === SwapAndBridgeFormStatus.ReadyToSubmit ||
              formStatus === SwapAndBridgeFormStatus.ReadyToEstimate ||
              formStatus === SwapAndBridgeFormStatus.InvalidRouteSelected) && (
              <>
                {/* TODO<oneClickSwap>: styling */}
                {formStatus === SwapAndBridgeFormStatus.ReadyToEstimate &&
                  (!signAccountOpController ||
                    signAccountOpController.estimation.status === EstimationStatus.Loading) && (
                    <View style={[styles.secondaryContainer, spacings.mb]}>
                      <Spinner />
                    </View>
                  )}

                {(formStatus === SwapAndBridgeFormStatus.ReadyToEstimate ||
                  formStatus === SwapAndBridgeFormStatus.ReadyToSubmit) &&
                  signAccountOpController && (
                    <View style={[styles.secondaryContainer, spacings.mb]}>
                      <Estimation
                        updateType="Swap&Bridge"
                        signAccountOpState={signAccountOpController}
                        disabled={
                          signAccountOpController.status?.type !== SigningStatus.ReadyToSign
                        }
                        hasEstimation={!!hasEstimation}
                        // TODO<oneClickSwap>
                        slowRequest={false}
                        // TODO<oneClickSwap>
                        isViewOnly={isViewOnly}
                        isSponsored={false}
                        sponsor={undefined}
                      />
                    </View>
                  )}

                {!!shouldConfirmFollowUpTransactions && (
                  <View style={spacings.mb}>
                    <Checkbox
                      value={followUpTransactionConfirmed}
                      style={{ ...spacings.mb0, ...flexbox.alignCenter }}
                      onValueChange={handleFollowUpTransactionConfirmedCheckboxPress}
                    >
                      <Text fontSize={12}>
                        <Text
                          fontSize={12}
                          weight="medium"
                          onPress={handleFollowUpTransactionConfirmedCheckboxPress}
                          testID="confirm-follow-up-txns-checkbox"
                          color={
                            followUpTransactionConfirmed
                              ? theme.primaryText
                              : theme.warningDecorative
                          }
                          style={[
                            styles.followUpTxnText,
                            !followUpTransactionConfirmed && {
                              backgroundColor: theme.warningBackground
                            }
                          ]}
                        >
                          {t('I understand that I need to do a follow-up transaction.')}
                        </Text>{' '}
                        <Text fontSize={12} underline weight="medium" onPress={handleOpenReadMore}>
                          {t('Read more.')}
                        </Text>
                      </Text>
                    </Checkbox>
                  </View>
                )}
              </>
            )}

            {!!highPriceImpactInPercentage && (
              <View style={spacings.mbTy} testID="high-price-impact-sab">
                <Alert type="error" withIcon={false}>
                  <Checkbox
                    value={highPriceImpactConfirmed}
                    style={{ ...spacings.mb0 }}
                    onValueChange={handleHighPriceImpactCheckboxPress}
                    uncheckedBorderColor={theme.errorDecorative}
                    checkedColor={theme.errorDecorative}
                  >
                    <Text
                      fontSize={16}
                      appearance="errorText"
                      weight="medium"
                      onPress={handleHighPriceImpactCheckboxPress}
                    >
                      {t('Warning: ')}
                      <Text
                        fontSize={16}
                        appearance="errorText"
                        onPress={handleHighPriceImpactCheckboxPress}
                      >
                        {t(
                          'The price impact is too high (-{{highPriceImpactInPercentage}}%). If you continue with this trade, you will lose a significant portion of your funds. Please tick the box to acknowledge that you have read and understood this warning.',
                          {
                            highPriceImpactInPercentage: highPriceImpactInPercentage.toFixed(1)
                          }
                        )}
                      </Text>
                    </Text>
                  </Checkbox>
                </Alert>
              </View>
            )}
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter, flexbox.justifyEnd]}>
            <Button
              hasBottomSpacing={false}
              text={t('Start a Batch')}
              type="secondary"
              style={{ minWidth: 160 }}
            />
            <Button
              text={
                mainCtrlStatuses.buildSwapAndBridgeUserRequest !== 'INITIAL'
                  ? t('Loading...') // prev Building Transaction
                  : highPriceImpactInPercentage
                  ? t('Proceed anyway')
                  : t('Proceed') // prev Proceed
              }
              disabled={
                formStatus !== SwapAndBridgeFormStatus.ReadyToSubmit ||
                shouldConfirmFollowUpTransactions !== followUpTransactionConfirmed ||
                (!!highPriceImpactInPercentage && !highPriceImpactConfirmed) ||
                mainCtrlStatuses.buildSwapAndBridgeUserRequest !== 'INITIAL' ||
                updateQuoteStatus === 'LOADING'
              }
              style={{ minWidth: 160, ...spacings.mlLg }}
              hasBottomSpacing={false}
              type={highPriceImpactInPercentage ? 'error' : 'primary'}
              onPress={handleSubmitForm}
            />
          </View>
        </View>
      </TabLayoutWrapperMainContent>
      <RoutesModal sheetRef={routesModalRef} closeBottomSheet={closeRoutesModal} />
    </TabLayoutContainer>
  )
}

export default React.memo(SwapAndBridgeScreen)

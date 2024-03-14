import { getAddress } from 'ethers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import Button from '@common/components/Button'
import CoingeckoConfirmedBadge from '@common/components/CoingeckoConfirmedBadge'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import networks from '@common/constants/networks'
import useTheme from '@common/hooks/useTheme'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import getTokenDetails from '@common/modules/dashboard/helpers/getTokenDetails'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { storage } from '@web/extension-services/background/webapi/storage'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

const WatchTokenRequestScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()
  const state = useNotificationControllerState()
  const portfolio = usePortfolioControllerState()
  const mainCtrl = useMainControllerState()
  const { providers } = useSettingsControllerState()

  const selectedAccount = mainCtrl.selectedAccount || ''

  // TODO: Handle if user has the token already
  // TODO: Add standard and handle different types
  const tokenStandard = state?.currentNotificationRequest?.params?.data?.type
  const tokenData = state?.currentNotificationRequest?.params?.data?.options
  const origin = state?.currentNotificationRequest?.params?.session?.origin
  const network = networks.find((n) => n.explorerUrl === origin)
  const [showAlreadyInPortfolioMessage, setShowAlreadyInPortfolioMessage] = useState(false)
  // const [tokenTypeEligibility, setTokenTypeEligibility] = useState(false)

  const tokenTypeEligibility = useMemo(
    () =>
      (tokenData && portfolio.state.validTokens.erc20[`${tokenData?.address}-${network?.id}`]) ||
      false,
    [portfolio.state.validTokens.erc20, tokenData, network?.id]
  )

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }, [t, dispatch])

  // Handle the case its already in token preferences
  const tokenInPreferences = useMemo(
    () =>
      tokenData &&
      portfolio.state.tokenPreferences?.find(
        ({ address }) => address === getAddress(tokenData?.address)
      ),
    []
  )
  const portfolioFoundToken = useMemo(
    () =>
      (tokenData &&
        portfolio.accountPortfolio?.tokens?.find(
          ({ address }) => address === getAddress(tokenData?.address)
        )) ||
      (tokenData &&
        portfolio.state.tokenPreferences?.find(
          ({ address }) => address === getAddress(tokenData?.address)
        )),
    []
  )

  console.log(portfolio)

  useEffect(() => {
    const handleToken = async () => {
      // const previousHints = await storage.get('previousHints')
      // console.log('previousHints', previousHints)
      await portfolio.checkToken({ ...tokenData, networkId: network.id })
    }
    if (!tokenData) return
    const address = getAddress(tokenData.address)
    // 1. step check if token is in portfolio
    if (portfolioFoundToken) setShowAlreadyInPortfolioMessage(true)
    if (!tokenTypeEligibility) handleToken()
    // 2. call checkTokenEligibility

    if (tokenTypeEligibility) {
      console.log(portfolioFoundToken, tokenTypeEligibility)
      if (!portfolioFoundToken) {
        portfolio.updateAdditionalHints([address])
      } else {
        // setShowAlreadyInPortfolioMessage(true)
      }
    }
  }, [tokenData, selectedAccount, tokenTypeEligibility])

  const handleAddToken = useCallback(async () => {
    const token = {
      address: getAddress(tokenData.address),
      name: tokenData?.name,
      symbol: tokenData?.symbol,
      decimals: tokenData?.decimals,
      standard: state?.currentNotificationRequest?.params?.data?.type,
      networkId: network?.id
    }

    await portfolio.updateTokenPreferences(token)
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_RESOLVE_REQUEST',
      params: { data: null }
    })
  }, [dispatch, state, tokenData, network, portfolio])

  const tokenDetails =
    portfolioFoundToken && portfolioFoundToken?.rewardsType && getTokenDetails(portfolioFoundToken)
  console.log(portfolioFoundToken, tokenTypeEligibility)
  return (
    <TabLayoutContainer
      width="full"
      header={<HeaderAccountAndNetworkInfo networkName={network?.name} networkId={network?.id} />}
      footer={
        <>
          <Button
            text={t('Cancel')}
            type="danger"
            hasBottomSpacing={false}
            style={spacings.phLg}
            onPress={handleCancel}
          >
            <View style={spacings.pl}>
              <CloseIcon color={theme.errorDecorative} />
            </View>
          </Button>
          {!showAlreadyInPortfolioMessage && tokenTypeEligibility && (
            <Button
              style={spacings.phLg}
              hasBottomSpacing={false}
              onPress={handleAddToken}
              // TODO: Loading and disabled states
              // disabled={isAddingToken}
              text={t('Add token')}
            />
          )}
        </>
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mbLg}>
        {!tokenTypeEligibility ? (
          <Text weight="medium" fontSize={20} style={spacings.mbLg}>
            {t('This token type is not supported.')}
          </Text>
        ) : (
          <>
            {showAlreadyInPortfolioMessage ? (
              <Text weight="medium" fontSize={20} style={spacings.mbLg}>
                {t('This token is already in your portfolio.')}
              </Text>
            ) : (
              <>
                <Text weight="medium" fontSize={20} style={spacings.mbLg}>
                  {t('Add suggested token')}
                </Text>
                <Text
                  weight="regular"
                  fontSize={16}
                  color={theme.secondaryText}
                  style={spacings.mbXl}
                >
                  {t('Would you like to add this token?')}
                </Text>
              </>
            )}

            <View
              style={{
                width: '100%',
                borderBottomWidth: 1,
                borderColor: theme.secondaryBorder,
                ...spacings.mb
              }}
            />
            <View style={[flexbox.directionRow, flexbox.justifySpaceBetween]}>
              <Text
                fontSize={12}
                weight="medium"
                style={[spacings.mbMd, { flex: 1 }]}
                appearance="secondaryText"
              >
                {t('ASSET/AMOUNT')}
              </Text>

              <Text
                fontSize={12}
                weight="medium"
                style={[spacings.mbMd, { flex: 0.7 }]}
                appearance="secondaryText"
              >
                {t('Price')}
              </Text>
              <Text
                fontSize={12}
                weight="medium"
                style={[
                  spacings.mbMd,
                  { textAlign: 'right', flex: portfolioFoundToken?.priceIn?.length ? 0.7 : 0.12 }
                ]}
                appearance="secondaryText"
              >
                {t('USD Value')}
              </Text>

              <View style={{ flex: portfolioFoundToken?.priceIn?.length ? 0.5 : 0 }} />
            </View>
            <View
              style={[
                flexbox.directionRow,
                flexbox.justifySpaceBetween,
                spacings.phTy,
                spacings.pvTy,
                !portfolioFoundToken || !portfolioFoundToken?.priceIn?.length
                  ? {
                      borderWidth: 1,
                      borderColor: '#CA7E04',
                      borderRadius: 6
                    }
                  : {}
              ]}
            >
              <View style={{ flex: 1 }}>
                <View style={[flexbox.directionRow]}>
                  <TokenIcon
                    withContainer
                    uri={tokenData?.image}
                    networkId={network?.id}
                    containerHeight={40}
                    containerWidth={40}
                    width={28}
                    height={28}
                  />
                  <View style={spacings.ml}>
                    <Text weight="number_bold" fontSize={16}>
                      {tokenDetails?.balance || '0.00'} {tokenData?.symbol}
                    </Text>

                    {network && (
                      <Text fontSize={12}>
                        {t('on')} {network.name}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={{ flex: 0.7 }}>
                <Text fontSize={16} style={{ textAlign: 'left' }}>
                  {tokenDetails?.priceUSDFormatted || '0.00'}
                </Text>
              </View>

              <View
                style={[
                  flexbox.alignEnd,
                  { flex: portfolioFoundToken?.priceIn?.length ? 0.7 : 0.12 }
                ]}
              >
                <View style={[flexbox.directionRow, flexbox.alignEnd]}>
                  <Text weight="number_bold" fontSize={16} style={flexbox.justifyEnd}>
                    {tokenDetails?.balanceUSDFormatted || '0.00'}
                  </Text>
                </View>
              </View>
              {portfolioFoundToken?.priceIn?.length ? (
                <View style={[flexbox.alignEnd, { flex: 0.5 }]}>
                  <CoingeckoConfirmedBadge text={t('Confirmed')} />
                </View>
              ) : null}
            </View>
          </>
        )}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(WatchTokenRequestScreen)

import { getAddress } from 'ethers'
import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import Button from '@common/components/Button'
import CoingeckoConfirmedBadge from '@common/components/CoingeckoConfirmedBadge'
import Spinner from '@common/components/Spinner'
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
import useBackgroundService from '@web/hooks/useBackgroundService'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'
import usePortfolioControllerState from '@web/hooks/usePortfolioControllerState/usePortfolioControllerState'

const WatchTokenRequestScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()
  const state = useNotificationControllerState()
  const portfolio = usePortfolioControllerState()
  // TODO: Handle if user has the token already
  // TODO: Add standard and handle different types
  const tokenData = state?.currentNotificationRequest?.params?.data?.options
  const origin = state?.currentNotificationRequest?.params?.session?.origin
  const network = networks.find((n) => n.explorerUrl === origin)

  // TODO: Notification window not closing
  const handleCancel = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }, [t, dispatch])

  const portfolioFoundToken =
    tokenData &&
    portfolio.accountPortfolio?.tokens?.find(
      ({ address }) => address === getAddress(tokenData?.address)
    )
  console.log(portfolioFoundToken)
  useEffect(() => {
    if (!tokenData) return
    const address = getAddress(tokenData.address)

    if (!portfolioFoundToken) {
      portfolio.updateAdditionalHints([address])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioFoundToken, tokenData])

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

  const tokenDetails = portfolioFoundToken && getTokenDetails(portfolioFoundToken)

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
          <Button
            style={spacings.phLg}
            hasBottomSpacing={false}
            onPress={handleAddToken}
            // TODO: Loading and disabled states
            // disabled={isAddingToken}
            text={t('Add token')}
          />
        </>
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mbLg}>
        <Text weight="medium" fontSize={20} style={spacings.mbLg}>
          {t('Add suggested token')}
        </Text>
        <Text weight="regular" fontSize={16} color={theme.secondaryText} style={spacings.mbXl}>
          {t('Would you like to add this token?')}
        </Text>

        <View
          style={{
            width: '100%',
            borderBottomWidth: 1,
            borderColor: theme.secondaryBorder,
            ...spacings.mb
          }}
        />

        <View style={[flexbox.directionRow, flexbox.justifySpaceBetween]}>
          <View>
            <Text fontSize={12} weight="medium" style={spacings.mbMd} appearance="secondaryText">
              {t('ASSET/AMOUNT')}
            </Text>
            <View style={flexbox.directionRow}>
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

          <View>
            <Text
              fontSize={12}
              weight="medium"
              style={[spacings.mbMd, { textAlign: 'left' }]}
              appearance="secondaryText"
            >
              {t('Price')}
            </Text>
            <Text fontSize={16} style={{ textAlign: 'left' }}>
              {tokenDetails?.priceUSDFormatted || <Spinner style={{ width: 18, height: 18 }} />}
            </Text>
          </View>

          <View style={[flexbox.alignEnd]}>
            <Text fontSize={12} weight="medium" style={spacings.mbMd} appearance="secondaryText">
              {t('USD Value')}
            </Text>

            <View style={[flexbox.directionRow, flexbox.alignEnd]}>
              <Text weight="number_bold" fontSize={16} style={flexbox.justifyEnd}>
                {tokenDetails?.balanceUSDFormatted || <Spinner style={{ width: 18, height: 18 }} />}
              </Text>
            </View>
          </View>
          {portfolioFoundToken?.priceIn?.length ? (
            <View style={[flexbox.alignEnd, flexbox.justifyCenter]}>
              <CoingeckoConfirmedBadge text={t('Confirmed')} containerStyle={spacings.mtMd} />
            </View>
          ) : null}
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(WatchTokenRequestScreen)

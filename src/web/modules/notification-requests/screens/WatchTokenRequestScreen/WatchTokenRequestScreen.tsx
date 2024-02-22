import React, { useCallback } from 'react'
import { View } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import Button from '@common/components/Button'
import CoingeckoConfirmedBadge from '@common/components/CoingeckoConfirmedBadge'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import networks from '@common/constants/networks'
import useTheme from '@common/hooks/useTheme'
import TokenIcon from '@common/modules/dashboard/components/TokenIcon'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import HeaderAccountAndNetworkInfo from '@web/components/HeaderAccountAndNetworkInfo'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
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
  const mainCtrl = useMainControllerState()
  const settingsCtrl = useSettingsControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const { accountPortfolio } = usePortfolioControllerState()

  // TODO: Notification window not closing
  const handleCancel = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }, [t, dispatch])

  // TODO:
  const handleAddToken = useCallback(() => {}, [])
  // TODO: Add standard and handle different types
  const tokenData = state?.currentNotificationRequest?.params?.data?.options
  const origin = state?.currentNotificationRequest?.params?.session?.origin
  const network = networks.find((n) => n.explorerUrl === origin)
  console.log(state)
  return (
    <TabLayoutContainer
      width="full"
      header={<HeaderAccountAndNetworkInfo networkName={network.name} networkId={network.id} />}
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
                uri={tokenData.image}
                networkId={network.id}
                containerHeight={40}
                containerWidth={40}
                width={28}
                height={28}
              />
              <View style={spacings.ml}>
                <Text weight="number_bold" fontSize={16}>
                  {tokenData.name} {tokenData.symbol}
                </Text>
                <Text fontSize={12}>
                  {t('on')} {network.name}
                </Text>
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
              $0.04
            </Text>
          </View>

          <View>
            <Text fontSize={12} weight="medium" style={spacings.mbMd} appearance="secondaryText">
              {t('USD Value')}
            </Text>
            <View style={flexbox.directionRow}>
              <Text
                weight="number_bold"
                fontSize={16}
                style={[{ textAlign: 'right' }, spacings.mr4Xl]}
              >
                $0.00
              </Text>
              <CoingeckoConfirmedBadge text={t('Confirmed')} />
            </View>
          </View>
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(WatchTokenRequestScreen)

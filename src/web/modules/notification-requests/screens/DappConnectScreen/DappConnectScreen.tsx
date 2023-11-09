/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback, useState } from 'react'
import { Image, View } from 'react-native'

// @ts-ignore
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import CloseIcon from '@common/assets/svg/CloseIcon'
import InfoIcon from '@common/assets/svg/InfoIcon'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import Button from '@common/components/Button'
import ExpandableCard from '@common/components/ExpandableCard'
import Label from '@common/components/Label'
import Text from '@common/components/Text'
import { Trans, useTranslation } from '@common/config/localization'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexbox from '@common/styles/utils/flexbox'
import textStyles from '@common/styles/utils/text'
import ManifestImage from '@web/components/ManifestImage'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useNotificationControllerState from '@web/hooks/useNotificationControllerState'

import styles from './styles'

// Screen for dApps authorization to connect to extension - will be triggered on dApp connect request
const DappConnectScreen = () => {
  const mainCtrl = useMainControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccountInfo = mainCtrl.accounts.find((acc) => acc.addr === selectedAccount)
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [isAuthorizing, setIsAuthorizing] = useState(false)

  const { dispatch } = useBackgroundService()
  const state = useNotificationControllerState()

  const handleDenyButtonPress = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }, [t, dispatch])

  const handleAuthorizeButtonPress = useCallback(() => {
    setIsAuthorizing(true)
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_RESOLVE_REQUEST',
      params: { data: null }
    })
  }, [dispatch])

  return (
    <TabLayoutContainer
      header={
        <Header withAmbireLogo mode="custom">
          <View
            style={[
              flexbox.flex1,
              flexbox.directionRow,
              flexbox.alignCenter,
              flexbox.justifySpaceBetween
            ]}
          >
            <View style={styles.accountInfo}>
              <Image style={styles.accountInfoIcon} source={avatarSpace} resizeMode="contain" />
              <View style={styles.accountAddressAndLabel}>
                {/* TODO: Hide this text element if the account doesn't have a label when labels are properly implemented */}
                <Text weight="number_bold" fontSize={16} appearance="secondaryText">
                  {selectedAccountInfo?.label ? selectedAccountInfo?.label : 'Account Label'}
                </Text>
                <Text weight="number_medium" style={styles.accountInfoText} fontSize={16}>
                  ({selectedAccount})
                </Text>
              </View>
            </View>
            <AmbireLogoHorizontal width={72} />
          </View>
        </Header>
      }
      footer={
        <>
          <Button
            text={t('Deny')}
            type="danger"
            hasBottomSpacing={false}
            style={spacings.phLg}
            onPress={handleDenyButtonPress}
          >
            <View style={spacings.pl}>
              <CloseIcon color={theme.errorDecorative} />
            </View>
          </Button>
          <View
            style={[
              flexbox.directionRow,
              flexbox.alignCenter,
              flexbox.flex1,
              spacings.ph,
              flexbox.justifyCenter
            ]}
          >
            <InfoIcon color={iconColors.primary} style={spacings.mrTy} />
            <Text
              fontSize={14}
              style={textStyles.center}
              weight="medium"
              appearance="secondaryText"
            >
              {t('Webpage can be disconnected any time from the Ambire extension settings.')}
            </Text>
          </View>
          <Button
            style={spacings.phLg}
            hasBottomSpacing={false}
            onPress={handleAuthorizeButtonPress}
            disabled={isAuthorizing}
            text={isAuthorizing ? t('Connecting...') : t('Connect')}
          />
        </>
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mbLg}>
        <Text weight="medium" fontSize={20} style={spacings.mb2Xl}>
          {t('Connection requested')}
        </Text>
        <View style={[spacings.pvSm, flexbox.alignCenter]}>
          <ManifestImage
            uri={state.currentNotificationRequest?.params?.icon}
            size={64}
            fallback={() => <ManifestFallbackIcon />}
          />
        </View>

        <Text
          style={[textStyles.center, spacings.phSm, spacings.mb]}
          fontSize={20}
          appearance="secondaryText"
          weight="semiBold"
        >
          {state.currentNotificationRequest?.params?.origin
            ? new URL(state.currentNotificationRequest?.params?.origin).hostname
            : ''}
        </Text>

        <View style={flexbox.alignCenter}>
          <Trans>
            <Text style={[textStyles.center, spacings.phSm, spacings.mbLg, { maxWidth: 520 }]}>
              <Text fontSize={16} weight="medium">
                {'The dApp '}
              </Text>
              <Text fontSize={16} weight="medium" appearance="primary">
                {state.currentNotificationRequest?.params?.name || ''}
              </Text>
              <Text fontSize={16} weight="medium">
                {' is requesting an authorization to communicate with Ambire Wallet'}
              </Text>
            </Text>
          </Trans>
        </View>
        <ExpandableCard
          enableExpand={false}
          content={
            <View
              style={[
                flexbox.flex1,
                flexbox.directionRow,
                flexbox.alignCenter,
                flexbox.wrap,
                spacings.mhSm
              ]}
            >
              <Trans>
                <Text fontSize={16} weight="semiBold" appearance="successText">
                  {'Allow'}{' '}
                </Text>
                <ManifestImage
                  uri={state.currentNotificationRequest?.params?.icon}
                  size={24}
                  fallback={() => <ManifestFallbackIcon />}
                />
                <Text fontSize={16} weight="semiBold">
                  {' '}
                  {state.currentNotificationRequest?.params?.name}{' '}
                </Text>
                <Text fontSize={16} weight="medium" appearance="secondaryText">
                  to{' '}
                </Text>
                <Text fontSize={16} weight="semiBold">
                  see your address{' '}
                </Text>
                <Text fontSize={16} weight="medium" appearance="secondaryText">
                  and{' '}
                </Text>
                <Text fontSize={16} weight="semiBold">
                  propose transactions{' '}
                </Text>
                <Text fontSize={16} weight="medium" appearance="secondaryText">
                  for your review and confirmation.
                </Text>
              </Trans>
            </View>
          }
        >
          <View
            style={{
              paddingHorizontal: 42 // magic number
            }}
          >
            <Label text={t('Only connect with sites you trust.')} type="warning" />
          </View>
        </ExpandableCard>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(DappConnectScreen)

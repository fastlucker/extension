import React, { useCallback, useState } from 'react'
import { Image, View } from 'react-native'

// @ts-ignore
import avatarSpace from '@common/assets/images/avatars/avatar-space.png'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import Title from '@common/components/Title'
import { Trans, useTranslation } from '@common/config/localization'
import Header from '@common/modules/header/components/Header'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
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

// Screen for dApps authorization - will be triggered on dApp connect request
const PermissionRequestScreen = () => {
  const mainCtrl = useMainControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccountInfo = mainCtrl.accounts.find((acc) => acc.addr === selectedAccount)
  const { t } = useTranslation()
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
                <Text weight="number_bold" fontSize={14}>
                  {selectedAccountInfo?.label ? selectedAccountInfo?.label : 'Account Label'}
                </Text>
                <Text weight="number_medium" style={styles.accountInfoText} fontSize={14}>
                  ({selectedAccount})
                </Text>
              </View>
            </View>
            <AmbireLogoHorizontal width={72} />
          </View>
        </Header>
      }
    >
      <TabLayoutWrapperMainContent>
        <Panel>
          <View style={[spacings.pvSm, flexbox.alignCenter]}>
            <ManifestImage
              uri={state.currentNotificationRequest?.params?.icon}
              size={64}
              fallback={() => <ManifestFallbackIcon />}
            />
          </View>

          <Title style={[textStyles.center, spacings.phSm, spacings.pbLg]}>
            {state.currentNotificationRequest?.params?.origin
              ? new URL(state.currentNotificationRequest?.params?.origin).hostname
              : ''}
          </Title>

          <View>
            <Trans>
              <Text style={[textStyles.center, spacings.phSm, spacings.mbLg]}>
                <Text fontSize={14} weight="regular">
                  {'The dApp '}
                </Text>
                <Text fontSize={14} weight="regular" color={colors.heliotrope}>
                  {state.currentNotificationRequest?.params?.name || ''}
                </Text>
                <Text fontSize={14} weight="regular">
                  {' is requesting an authorization to communicate with Ambire Wallet'}
                </Text>
              </Text>
            </Trans>
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                disabled={isAuthorizing}
                type="danger"
                onPress={handleDenyButtonPress}
                text={t('Deny')}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                type="outline"
                onPress={handleAuthorizeButtonPress}
                disabled={isAuthorizing}
                text={isAuthorizing ? t('Authorizing...') : t('Authorize')}
              />
            </View>
          </View>

          <Text fontSize={14} style={textStyles.center}>
            {t('Webpage can be disconnected any time from the Ambire extension settings.')}
          </Text>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(PermissionRequestScreen)

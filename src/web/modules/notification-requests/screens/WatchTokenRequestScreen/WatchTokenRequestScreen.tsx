import React, { useCallback } from 'react'
import { View } from 'react-native'

import CloseIcon from '@common/assets/svg/CloseIcon'
import ManifestFallbackIcon from '@common/assets/svg/ManifestFallbackIcon'
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import { Avatar } from '@common/components/Avatar'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
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
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'

// TODO: Reuse styles?
import styles from '../DappConnectScreen/styles'

const WatchTokenRequestScreen = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()
  const state = useNotificationControllerState()
  const mainCtrl = useMainControllerState()
  const settingsCtrl = useSettingsControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccountPref = settingsCtrl.accountPreferences[selectedAccount]

  const handleCancel = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }, [t, dispatch])

  // TODO:
  const handleAddToken = useCallback(() => {}, [])

  return (
    <TabLayoutContainer
      width="full"
      header={
        // TODO: Re-use Header from DappConnectScreen?
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
              <Avatar pfp={selectedAccountPref?.pfp} size={32} />
              <View style={styles.accountAddressAndLabel}>
                <Text weight="number_bold" fontSize={16} appearance="secondaryText">
                  {selectedAccountPref?.label || DEFAULT_ACCOUNT_LABEL}
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
        <Text weight="regular" fontSize={16} style={spacings.mb2Xl}>
          {t('Would you like to add this token?')}
        </Text>

        {/* TODO: Display token details */}
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(WatchTokenRequestScreen)

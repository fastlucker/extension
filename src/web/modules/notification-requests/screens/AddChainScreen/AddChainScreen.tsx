/* eslint-disable react/jsx-no-useless-fragment */
import React, { useCallback } from 'react'
import { View } from 'react-native'

// @ts-ignore
import CloseIcon from '@common/assets/svg/CloseIcon'
import AmbireLogoHorizontal from '@common/components/AmbireLogoHorizontal'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import { DEFAULT_ACCOUNT_LABEL } from '@common/constants/account'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import useBackgroundService from '@web/hooks/useBackgroundService'
import useMainControllerState from '@web/hooks/useMainControllerState'
import useSettingsControllerState from '@web/hooks/useSettingsControllerState'
import { Avatar } from '@web/modules/account-personalize/components/AccountPersonalizeCard/avatar'

import styles from './styles'

// Screen for dApps authorization to connect to extension - will be triggered on dApp connect request
const AddChainScreen = () => {
  const mainCtrl = useMainControllerState()
  const settingsCtrl = useSettingsControllerState()
  const selectedAccount = mainCtrl.selectedAccount || ''
  const selectedAccountPref = settingsCtrl.accountPreferences[selectedAccount]
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { dispatch } = useBackgroundService()

  const handleDenyButtonPress = useCallback(() => {
    dispatch({
      type: 'NOTIFICATION_CONTROLLER_REJECT_REQUEST',
      params: { err: t('User rejected the request.') }
    })
  }, [t, dispatch])

  return (
    <TabLayoutContainer
      width="full"
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
              <Avatar pfp={selectedAccountPref.pfp} size={32} />
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
        </>
      }
    >
      <TabLayoutWrapperMainContent style={spacings.mbLg}>
        <View style={[flexbox.flex1, flexbox.alignCenter, flexbox.justifyCenter]}>
          <Text fontSize={30}>Add Chain Screen</Text>
          <Text fontSize={20}>(coming soon)</Text>
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(AddChainScreen)

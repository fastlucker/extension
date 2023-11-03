import React, { useCallback, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import EmailIcon from '@common/assets/svg/EmailIcon'
import HWIcon from '@common/assets/svg/HWIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import UpArrowIcon from '@common/assets/svg/UpArrowIcon'
import Button from '@common/components/Button'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import { iconColors } from '@common/styles/themeConfig'
import flexboxStyles from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { storage } from '@web/extension-services/background/webapi/storage'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Card from '@web/modules/auth/components/Card'

import getStyles from './styles'

const GetStartedScreen = () => {
  const { styles, theme } = useTheme(getStyles)
  const { t } = useTranslation()
  const keystoreState = useKeystoreControllerState()
  const { navigate } = useNavigation()
  const [seeMoreOptionsEnabled, setSeeMoreOptionsEnabled] = useState(false)

  const handleAuthButtonPress = useCallback(
    async (flow: 'email' | 'hw' | 'legacy' | 'view-only') => {
      const hasTerms = await storage.get('termsState', false)

      if (!hasTerms) {
        navigate(WEB_ROUTES.terms, { state: { flow } })
        return
      }
      if (flow === 'view-only') {
        navigate(WEB_ROUTES.viewOnlyAccountAdder)
        return
      }
      if (!keystoreState.isReadyToStoreKeys && flow !== 'hw') {
        navigate(WEB_ROUTES.keyStoreSetup, { state: { flow } })
        return
      }
      if (flow === 'email') {
        navigate(WEB_ROUTES.createEmailVault)
        return
      }
      if (flow === 'hw') {
        navigate(WEB_ROUTES.hardwareWalletSelect)
        return
      }
      if (flow === 'legacy') {
        navigate(WEB_ROUTES.externalSigner)
      }
    },
    [navigate, keystoreState]
  )
  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      width="lg"
      header={<Header mode="title" withAmbireLogo />}
    >
      <TabLayoutWrapperMainContent>
        <Panel title={t('Choose Account Type')} style={spacings.mbMd}>
          <View style={[flexboxStyles.directionRow]}>
            <Card
              title={t('Hardware wallet')}
              text={t(
                'Import multiple accounts from a hardware wallet device: we support Trezor, Ledger and Grid+ Lattice.\n\nYou can import your existing legacy accounts and smart accounts.'
              )}
              style={flexboxStyles.flex1}
              icon={HWIcon}
              buttonText={t('Import From Hardware Wallet')}
              onPress={() => handleAuthButtonPress('hw')}
            />
            <Card
              title={t('Legacy Account')}
              style={{
                ...flexboxStyles.flex1,
                ...spacings.mhSm
              }}
              text={t(
                'Import a private key or seed phrase from a traditional wallet like Metamask.\n\nYou can import a legacy account but also create a fresh smart account from the same keys.'
              )}
              icon={ImportAccountIcon}
              buttonText={t('Import Legacy Account')}
              onPress={() => handleAuthButtonPress('legacy')}
            />
            <Card
              title={t('Email account')}
              text={t(
                'Create a smart account with email and password. This account will be recoverable via your email address.'
              )}
              icon={EmailIcon}
              style={flexboxStyles.flex1}
              onPress={() => handleAuthButtonPress('email')}
              buttonText={t('Create Email Account')}
            />
          </View>
        </Panel>
        <View style={styles.showMoreOptionsButtonContainer}>
          <View style={styles.separatorHorizontal} />

          <TouchableOpacity
            style={styles.showMoreOptionsButton}
            activeOpacity={1}
            onPress={() => setSeeMoreOptionsEnabled((prev) => !prev)}
          >
            {seeMoreOptionsEnabled ? (
              <UpArrowIcon color={iconColors.secondary} />
            ) : (
              <DownArrowIcon color={iconColors.secondary} />
            )}
            <Text fontSize={16} appearance="secondaryText" style={[spacings.mlMi]} weight="medium">
              {t('Show more options')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[flexboxStyles.flex1]}>
          {seeMoreOptionsEnabled && (
            <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mb]}>
              <Button
                textStyle={{ fontSize: 14 }}
                accentColor={theme.primary}
                text={t('View Mode')}
                onPress={() => handleAuthButtonPress('view-only')}
                type="outline"
                hasBottomSpacing={false}
                style={[{ minWidth: 190 }, spacings.mrLg]}
              />
              <Text fontSize={14} appearance="secondaryText">
                {t(
                  'Import an account in view-only mode, only via the address. You can import multiple at once.'
                )}
              </Text>
            </View>
          )}
        </View>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default GetStartedScreen

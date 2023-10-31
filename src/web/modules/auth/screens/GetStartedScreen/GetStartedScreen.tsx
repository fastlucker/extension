import React, { useCallback, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import DownArrowIcon from '@common/assets/svg/DownArrowIcon'
import EmailIcon from '@common/assets/svg/EmailIcon'
import HWIcon from '@common/assets/svg/HWIcon'
import ImportAccountIcon from '@common/assets/svg/ImportAccountIcon'
import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { storage } from '@web/extension-services/background/webapi/storage'
import useKeystoreControllerState from '@web/hooks/useKeystoreControllerState'
import Card from '@web/modules/auth/components/Card'

import styles from './styles'

const GetStartedScreen = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const keystoreState = useKeystoreControllerState()
  const { navigate } = useNavigation()
  const [advanceModeEnabled, setAdvancedModeEnabled] = useState(false)

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
        navigate(WEB_ROUTES.emailVault)
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
    <TabLayoutWrapperMainContent width="md">
      <View style={[flexboxStyles.center]}>
        <Text fontSize={22} weight="medium">
          {t('Welcome to Ambire')}
        </Text>
        <Text fontSize={14} weight="medium" style={[spacings.mbLg]}>
          {t('Choose Account Type')}
        </Text>
        <View style={[flexboxStyles.directionRow]}>
          <Card
            title="Hardware wallet"
            text={
              'Import multiple accounts from a hardware wallet device: we support Trezor, Ledger and Grid+ Lattice.\n\nYou can import your existing legacy accounts and smart accounts.'
            }
            style={flexboxStyles.flex1}
            icon={HWIcon}
            buttonText="Import From Hardware Wallet"
            onPress={() => handleAuthButtonPress('hw')}
          />
          <Card
            title="Legacy Account"
            style={{
              ...flexboxStyles.flex1,
              ...spacings.mhSm
            }}
            text={
              'Import a private key or seed phrase from a traditional wallet like Metamask.\n\nYou can import a legacy account but also create a fresh smart account from the same keys.'
            }
            icon={ImportAccountIcon}
            buttonText="Import Legacy Account"
            onPress={() => handleAuthButtonPress('legacy')}
          />
          <Card
            title="Email account"
            text="Create a smart account with email and password. This account will be recoverable via your email address."
            icon={EmailIcon}
            style={flexboxStyles.flex1}
            onPress={() => handleAuthButtonPress('email')}
            buttonText="Create Email Account"
          />
        </View>

        <View style={[flexboxStyles.directionRow, flexboxStyles.justifySpaceBetween]}>
          <View style={styles.hr} />
          <TouchableOpacity
            style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.ph]}
            onPress={() => setAdvancedModeEnabled((prev) => !prev)}
          >
            <DownArrowIcon
              isActive={advanceModeEnabled}
              color={colors.martinique}
              withRect={false}
            />
            <Text fontSize={14} style={[spacings.mlMi]} weight="medium">
              {t('Show more options')}
            </Text>
          </TouchableOpacity>
          <View style={styles.hr} />
        </View>

        <View style={[flexboxStyles.flex1]}>
          {advanceModeEnabled && (
            <>
              <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mb]}>
                <Button
                  text={t('Import From File')}
                  type="outline"
                  hasBottomSpacing={false}
                  style={[{ minWidth: 190 }, spacings.mrMd]}
                  textStyle={{ fontSize: 14 }}
                  accentColor={theme.primary}
                  onPress={() => handleAuthButtonPress(WEB_ROUTES.ambireAccountJsonLogin)}
                />
                <Text shouldScale={false} fontSize={12} weight="regular">
                  {t(
                    'Import an account from a JSON file. The account needs to be exported from Ambire Wallet. Files exported from other wallet providers are not supported.'
                  )}
                </Text>
              </View>
              <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mb]}>
                <Button
                  textStyle={{ fontSize: 14 }}
                  accentColor={theme.primary}
                  text={t('View Mode')}
                  onPress={() => handleAuthButtonPress('view-only')}
                  type="outline"
                  hasBottomSpacing={false}
                  style={[{ minWidth: 190 }, spacings.mrMd]}
                />
                <Text shouldScale={false} fontSize={12} weight="regular">
                  {t(
                    'Import an account in view-only mode, only via the address. You can import multiple at once.'
                  )}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </TabLayoutWrapperMainContent>
  )
}

export default GetStartedScreen

import React, { useCallback, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import { AuthLayoutWrapperMainContent } from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import Card from '@web/modules/auth/components/Card'
import EmailIcon from '@web/modules/auth/screens/GetStartedScreen/EmailIcon'
import HWIcon from '@web/modules/auth/screens/GetStartedScreen/HWIcon'
import ImportAccountIcon from '@web/modules/auth/screens/GetStartedScreen/ImportAccountIcon'
import DownArrow from '@web/modules/auth/screens/GetStartedScreen/DownArrow'

import styles from './styles'

const GetStartedScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const [advanceModeEnabled, setAdvancedModeEnabled] = useState(true)

  const handleAuthButtonPress = useCallback((nextRoute: any) => navigate(nextRoute), [navigate])

  return (
    <AuthLayoutWrapperMainContent fullWidth>
      <View style={[flexboxStyles.center]}>
        <Text fontSize={32} weight="medium">
          Welcome to Ambire
        </Text>
        <Text fontSize={20} weight="medium" style={[spacings.mbLg]}>
          Choose Account Type
        </Text>
        <View style={[flexboxStyles.directionRow]}>
          <Card
            title={t('Email account')}
            text={t(
              'Create a smart account with email and password. This account will be recoverable via your email address.'
            )}
            icon={<EmailIcon />}
          >
            <Button
              text={t('Create Email Account')}
              onPress={() => handleAuthButtonPress(ROUTES.authEmailAccount)}
              hasBottomSpacing={false}
            />
          </Card>
          <Card
            style={{ marginHorizontal: 16 }}
            title={t('Hardware wallet')}
            text={t(
              'Import multiple accounts from a hardware wallet device: we support Trezor, Ledger and Grid+ Lattice.\n\nYou can import your existing legacy accounts and smart accounts.'
            )}
            icon={<HWIcon />}
          >
            <Button
              text={t('Import From Hardware Wallet')}
              onPress={() => handleAuthButtonPress(ROUTES.hardwareWalletSelect)}
              disabled // temporary disabled until we have this feature
              hasBottomSpacing={false}
            />
          </Card>
          <Card
            title={t('Legacy Account')}
            text={t(
              'Import a private key or seed phrase from a traditional wallet like Metamask.\n\nYou can import a legacy account but also create a fresh smart account from the same keys.'
            )}
            icon={<ImportAccountIcon />}
          >
            <Button
              text={t('Import Legacy Account')}
              onPress={() => handleAuthButtonPress(ROUTES.externalSigner)}
              hasBottomSpacing={false}
            />
          </Card>
        </View>

        <View style={[flexboxStyles.directionRow, flexboxStyles.justifySpaceBetween]}>
          <View style={styles.hr} />
          <TouchableOpacity
            style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.ph]}
            onPress={() => setAdvancedModeEnabled(!advanceModeEnabled)}
          >
            <DownArrow isActive={advanceModeEnabled} />
            <Text fontSize={16} style={[spacings.mlMi]} weight="medium">
              Show more options
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
                  accentColor={colors.violet}
                  onPress={() => handleAuthButtonPress(ROUTES.ambireAccountJsonLogin)}
                />
                <Text shouldScale={false} fontSize={12} weight="regular">
                  {t(
                    'Import an account from a JSON file. The account needs to be exported from Ambire Wallet. Files exported from other wallet providers are not supported.'
                  )}
                </Text>
              </View>
              <View style={[flexboxStyles.directionRow, flexboxStyles.alignCenter, spacings.mb]}>
                <Button
                  accentColor={colors.violet}
                  text={t('View Mode')}
                  disabled // temporary disabled until we have this feature
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
    </AuthLayoutWrapperMainContent>
  )
}

export default GetStartedScreen

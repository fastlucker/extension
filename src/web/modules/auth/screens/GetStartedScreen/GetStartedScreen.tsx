import React, { useCallback, useState } from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/constants/common'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import AmbireSmallWhiteLogo from '@web/components/AmbireSmallWhiteLogo'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
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
    <AuthLayoutWrapperMainContent>
      <View style={[flexboxStyles.center]}>
        <Text fontSize={20}>Welcome to Ambire</Text>
        <Text>Choose Account Type</Text>
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
              'Import multiple accounts from a hardware wallet device: we support Trezor, Ledger and Grid+ Lattice.\nYou can import your existing legacy accounts and smart accounts.'
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
              'Import a private key or seed phrase from a traditional wallet like Metamask.\nYou can import a legacy account but also create a fresh smart account from the same keys.'
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
      </View>

      <View style={[flexboxStyles.flex1, flexboxStyles.directionRow, flexboxStyles.justifyCenter]}>
        <View style={styles.hr} />
        <DownArrow />
        <Text fontSize={16} weight="medium">
          Show more options
        </Text>
        <View style={styles.hr} />
      </View>
      <View>
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
    </AuthLayoutWrapperMainContent>
  )
}

export default GetStartedScreen

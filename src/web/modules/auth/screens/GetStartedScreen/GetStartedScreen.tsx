import React from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Wrapper, { WRAPPER_TYPES } from '@common/components/Wrapper'
import { isWeb } from '@common/config/env'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import AmbireLogo from '@common/modules/auth/components/AmbireLogo'
import { ROUTES } from '@common/modules/router/config/routesConfig'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'

const GetStartedScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <Text weight="light" style={spacings.mbTy} color={colors.titan} fontSize={13}>
          {t('Welcome to the {{name}}. Let’s set up your Key Store passphrase.', {
            name: isWeb ? t('Ambire Wallet extension') : t('Ambire Wallet')
          })}
        </Text>
        <Text weight="light" style={spacings.mbTy} color={colors.titan} fontSize={13}>
          {t(
            '1.  Ambire Key Store will protect your Ambire wallet with email password or external signer on this device.'
          )}
        </Text>
        <Text weight="light" style={spacings.mbTy} color={colors.titan} fontSize={13}>
          {t(
            '2.  First, pick your Ambire Key Store passphrase. It is unique for this device and it should be different from your account password.'
          )}
        </Text>
        <Text weight="light" color={colors.titan} fontSize={13}>
          {t(
            '3.  You will use your passphrase to unlock the {{name}} and sign transactions on this device.',
            { name: isWeb ? t('Ambire extension') : t('Ambire Wallet') }
          )}
        </Text>

        <Button
          style={spacings.mt}
          text={t('Get Started')}
          onPress={() => navigate(ROUTES.createVault, { replace: true })}
        />
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent>
        <Text>Welcome</Text>
        <Text>to the Ambire Wallet Extension</Text>
        <Text>v2.0</Text>
        <Text>Logo</Text>
        <AmbireLogo />
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default GetStartedScreen

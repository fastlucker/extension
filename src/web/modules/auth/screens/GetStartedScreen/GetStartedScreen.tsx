import React, { useCallback, useState } from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import Wrapper from '@common/components/Wrapper'
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
  const [advanceModeEnabled, setAdvancedModeEnabled] = useState(true)

  const handleAuthButtonPress = useCallback((nextRoute: ROUTES) => navigate(nextRoute), [navigate])

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <Button
          text={t('Email account')}
          onPress={() => handleAuthButtonPress(ROUTES.ambireAccountLogin)}
        />
        <Button
          text={t('HW Login (coming soon)')}
          onPress={() => handleAuthButtonPress(ROUTES.hardwareWallet)}
          disabled // temporary disabled until we have this feature
        />
        <Button
          text={t('Import account')}
          onPress={() => handleAuthButtonPress(ROUTES.externalSigner)}
        />

        <View style={{ marginVertical: 70, height: 2, backgroundColor: colors.mischka }} />

        <Toggle
          id="advanced-mode-toggle"
          isOn={advanceModeEnabled}
          label={t('Advanced mode')}
          onToggle={setAdvancedModeEnabled}
        />
        {advanceModeEnabled && (
          <>
            <Button
              text={t('Import From JSON')}
              type="outline"
              onPress={() => handleAuthButtonPress(ROUTES.ambireAccountJsonLogin)}
            />
            <Button
              text={t('View mode (coming soon)')}
              disabled // temporary disabled until we have this feature
              type="outline"
            />
          </>
        )}
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

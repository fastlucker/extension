import React, { useCallback, useState } from 'react'
import { View } from 'react-native'

import Button from '@common/components/Button'
import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Text from '@common/components/Text'
import Toggle from '@common/components/Toggle'
import Wrapper from '@common/components/Wrapper'
import { useTranslation } from '@common/config/localization'
import useNavigation from '@common/hooks/useNavigation'
import { ROUTES } from '@common/modules/router/config/routesConfig'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexboxStyles from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import AmbireLogo from '@web/components/AmbireLogo/AmbireLogo'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import Card from '@web/components/Card'

const GetStartedScreen = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const [advanceModeEnabled, setAdvancedModeEnabled] = useState(true)

  const handleAuthButtonPress = useCallback((nextRoute: ROUTES) => navigate(nextRoute), [navigate])

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <View style={[flexboxStyles.directionRow, flexboxStyles.justifyCenter]}>
          <Card text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, rerum?">
            <Button
              text={t('Email account')}
              onPress={() => handleAuthButtonPress(ROUTES.authEmailAccount)}
              hasBottomSpacing={false}
            />
          </Card>
          <Card
            style={{ marginHorizontal: 40 }}
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, rerum?"
          >
            <Button
              text={t('HW Login')}
              onPress={() => handleAuthButtonPress(ROUTES.hardwareWallet)}
              disabled // temporary disabled until we have this feature
              hasBottomSpacing={false}
            />
          </Card>
          <Card text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, rerum?">
            <Button
              text={t('Import Account')}
              onPress={() => handleAuthButtonPress(ROUTES.externalSigner)}
              hasBottomSpacing={false}
            />
          </Card>
        </View>

        <View style={{ marginVertical: 70, height: 1, backgroundColor: colors.mischka }} />

        <Toggle
          id="advanced-mode-toggle"
          isOn={advanceModeEnabled}
          label={t('Advanced mode')}
          onToggle={setAdvancedModeEnabled}
        />
        {advanceModeEnabled && (
          <>
            <Button
              text={t('Import JSON')}
              type="outline"
              onPress={() => handleAuthButtonPress(ROUTES.ambireAccountJsonLogin)}
            />
            <Button
              text={t('View Mode (coming soon)')}
              disabled // temporary disabled until we have this feature
              type="outline"
            />
          </>
        )}
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent>
        <View style={[text.center, flexboxStyles.justifySpaceBetween, flexboxStyles.flex1]}>
          <View>
            <Text fontSize={40} weight="semiBold">
              {t('Welcome')}
            </Text>
            <Text fontSize={20}>{t('to the Ambire Wallet Extension')}</Text>
            <Text fontSize={30}>v2.0</Text>
          </View>
          <AmbireLogo
            style={{ position: 'absolute', bottom: 27, right: '50%', marginRight: -46, zIndex: 10 }}
          />
        </View>
      </AuthLayoutWrapperSideContent>
    </>
  )
}

export default GetStartedScreen

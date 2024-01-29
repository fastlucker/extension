import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, View } from 'react-native'

import tokensEarnedImg from '@common/assets/images/TokensEarned.png'
import Panel from '@common/components/Panel'
import Text from '@common/components/Text'
import useNavigation from '@common/hooks/useNavigation'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import { WEB_ROUTES } from '@common/modules/router/constants/common'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import text from '@common/styles/utils/text'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import { storage } from '@web/extension-services/background/webapi/storage'
import useMainControllerState from '@web/hooks/useMainControllerState'
import PinExtension from '@web/modules/onboarding/components/PinExtension/PinExtension'
import { ONBOARDING_VALUES } from '@web/modules/onboarding/contexts/onboardingContext/types'
import useOnboarding from '@web/modules/onboarding/hooks/useOnboarding'

import ConfettiAnimation from '../../components/ConfettiAnimation'
import getStyles from './styles'

const OnBoardingScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { navigate } = useNavigation()
  const { setOnboardingStatus } = useOnboarding()
  const mainState = useMainControllerState()
  useEffect(() => {
    if (mainState.accounts.length) {
      setOnboardingStatus(ONBOARDING_VALUES.ON_BOARDED)
    }
  }, [setOnboardingStatus, mainState.accounts.length])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      const status = await storage.get('onboardingStatus', ONBOARDING_VALUES.NOT_ON_BOARDED)

      if (status === ONBOARDING_VALUES.ON_BOARDED) {
        navigate(WEB_ROUTES.dashboard)
      }
    })()
  }, [navigate])

  return (
    <TabLayoutContainer
      width="sm"
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content">
          <PinExtension style={styles.pinExtension} />
        </Header>
      }
    >
      <TabLayoutWrapperMainContent
        style={[spacings.pt2Xl]}
        contentContainerStyle={{ ...flexbox.justifyCenter, flexGrow: 1 }}
      >
        <Panel>
          <View style={styles.confettiAnimationContainer}>
            <ConfettiAnimation />
          </View>
          <Image style={styles.tokensImg} source={tokensEarnedImg} />
          <Text weight="medium" fontSize={20} style={[text.center, spacings.mb]}>
            {t("You've just earned $WALLET rewards for creating a new fresh account.")}
          </Text>
          <Text underline appearance="primary" fontSize={14} weight="medium" style={text.center}>
            {t('Check how you can earn more')}
          </Text>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(OnBoardingScreen)

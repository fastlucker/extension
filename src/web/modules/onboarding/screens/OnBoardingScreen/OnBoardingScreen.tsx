import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, Pressable, View } from 'react-native'

import tokensEarnedImg from '@common/assets/images/tokensEarned.png'
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
import { ONBOARDING_VALUES } from '@web/extension-services/background/controllers/wallet-state'
import { storage } from '@web/extension-services/background/webapi/storage'
import PinExtension from '@web/modules/onboarding/components/PinExtension/PinExtension'

import ConfettiAnimation from '../../components/ConfettiAnimation'
import getStyles from './styles'

const OnBoardingScreen = () => {
  const { theme, styles } = useTheme(getStyles)
  const { t } = useTranslation()
  const { navigate } = useNavigation()

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
      width="md"
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content">
          <PinExtension style={styles.pinExtension} />
        </Header>
      }
    >
      <TabLayoutWrapperMainContent
        style={[spacings.pt2Xl]}
        contentContainerStyle={{ ...flexbox.alignCenter, ...flexbox.justifyCenter, flexGrow: 1 }}
      >
        <Panel style={{ width: 442, ...spacings.pt2Xl }}>
          <View style={styles.confettiAnimationContainer}>
            <ConfettiAnimation />
          </View>
          <Image style={styles.tokensImg} source={tokensEarnedImg} />
          <Text weight="medium" fontSize={20} style={[text.center, spacings.mb2Xl]}>
            {t("You've just earned $WALLET rewards for creating a new fresh account.")}
          </Text>
          <Pressable
            onPress={() => {
              Linking.openURL('https://blog.ambire.com/announcing-the-wallet-token/')
            }}
          >
            <Text underline appearance="primary" fontSize={14} weight="medium" style={text.center}>
              {t('Check how you can earn more')}
            </Text>
          </Pressable>
        </Panel>
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default React.memo(OnBoardingScreen)

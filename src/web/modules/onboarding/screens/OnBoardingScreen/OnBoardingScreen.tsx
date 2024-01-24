import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'

import PlayButton from '@common/assets/svg/PlayButton'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Panel from '@common/components/Panel'
import useTheme from '@common/hooks/useTheme'
import Header from '@common/modules/header/components/Header'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent,
  TabLayoutWrapperSideContent,
  TabLayoutWrapperSideContentItem
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import PinExtension from '@web/modules/onboarding/components/PinExtension/PinExtension'
import { ONBOARDING_VALUES } from '@web/modules/onboarding/contexts/onboardingContext/types'
import useOnboarding from '@web/modules/onboarding/hooks/useOnboarding'

import getStyles from './styles'

const OnBoardingScreen = () => {
  const { t } = useTranslation()
  const { theme, styles } = useTheme(getStyles)

  const { setOnboardingStatus } = useOnboarding()
  useEffect(() => {
    setOnboardingStatus(ONBOARDING_VALUES.ON_BOARDED)
  }, [setOnboardingStatus])

  return (
    <TabLayoutContainer
      backgroundColor={theme.secondaryBackground}
      header={
        <Header mode="custom-inner-content">
          <PinExtension style={styles.pinExtension} />
        </Header>
      }
    >
      <TabLayoutWrapperMainContent style={spacings.pt2Xl}>
        <Panel title={t('How To Use Ambire Wallet')}>
          <View style={styles.videoBackground}>
            <PlayButton />
          </View>
        </Panel>
      </TabLayoutWrapperMainContent>
      <TabLayoutWrapperSideContent style={spacings.pt2Xl}>
        <TabLayoutWrapperSideContentItem title="How to pin Ambire Wallet extension">
          <TabLayoutWrapperSideContentItem.Text>TODO</TabLayoutWrapperSideContentItem.Text>
        </TabLayoutWrapperSideContentItem>
        <TabLayoutWrapperSideContentItem title="How to fund your wallet?">
          <TabLayoutWrapperSideContentItem.Text>TODO</TabLayoutWrapperSideContentItem.Text>
        </TabLayoutWrapperSideContentItem>
        <TabLayoutWrapperSideContentItem title="What are the Wallet Reward?">
          <TabLayoutWrapperSideContentItem.Text>TODO</TabLayoutWrapperSideContentItem.Text>
        </TabLayoutWrapperSideContentItem>
      </TabLayoutWrapperSideContent>
    </TabLayoutContainer>
  )
}

export default OnBoardingScreen

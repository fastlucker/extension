import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import PlayButton from '@common/assets/svg/PlayButton'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'
import {
  TabLayoutContainer,
  TabLayoutWrapperMainContent
} from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
import PinExtension from '@web/modules/onboarding/components/PinExtension/PinExtension'
import { ONBOARDING_VALUES } from '@web/modules/onboarding/contexts/onboardingContext/types'
import useOnboarding from '@web/modules/onboarding/hooks/useOnboarding'

import styles from './styles'

const OnBoardingScreen = () => {
  const { t } = useTranslation()

  const { setOnboardingStatus } = useOnboarding()
  useEffect(() => {
    setOnboardingStatus(ONBOARDING_VALUES.ON_BOARDED)
  }, [setOnboardingStatus])

  return (
    <TabLayoutContainer>
      <TabLayoutWrapperMainContent>
        <View style={styles.wrapper}>
          <Text shouldScale={false} fontSize={20} weight="medium" style={styles.title}>
            {t('How To Use Ambire Wallet')}
          </Text>
          <View style={styles.videoBackground}>
            <PlayButton />
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbXl]}>
            <RightArrowIcon color={colors.martinique} width={6} />
            <Text style={spacings.ml} underline>
              {t('How to pin Ambire Wallet extension?')}
            </Text>
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbXl]}>
            <RightArrowIcon color={colors.martinique} width={6} />
            <Text style={spacings.ml} underline>
              {t('How to fund your wallet?')}
            </Text>
          </View>
          <View style={[flexbox.directionRow, flexbox.alignCenter, spacings.mbXl]}>
            <RightArrowIcon color={colors.martinique} width={6} />
            <Text style={spacings.ml} underline>
              {t('What are the Wallet Reward?')}
            </Text>
          </View>
        </View>
        <PinExtension style={styles.pinExtension} />
      </TabLayoutWrapperMainContent>
    </TabLayoutContainer>
  )
}

export default OnBoardingScreen

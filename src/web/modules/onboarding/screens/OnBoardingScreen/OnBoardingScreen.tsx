import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import PlayButton from '@common/assets/svg/PlayButton'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import { TabLayoutWrapperMainContent } from '@web/components/TabLayoutWrapper/TabLayoutWrapper'
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
    <TabLayoutWrapperMainContent width="md" hideHeader>
      <View style={styles.wrapper}>
        <Text shouldScale={false} fontSize={20} weight="medium" style={styles.title}>
          {t('How To Use Ambire Wallet')}
        </Text>
        <View style={styles.videoBackground}>
          <PlayButton />
        </View>
        <Text style={styles.link} underline>
          <RightArrowIcon
            withRect={false}
            color={colors.martinique}
            width={20}
            height={20}
            style={{ marginBottom: -4 }}
          />
          {t('How to pin Ambire Wallet extension?')}
        </Text>
        <Text style={styles.link} underline>
          <RightArrowIcon
            withRect={false}
            color={colors.martinique}
            width={20}
            height={20}
            style={{ marginBottom: -4 }}
          />
          {t('How to fund your wallet?')}
        </Text>
        <Text style={styles.link} underline>
          <RightArrowIcon
            withRect={false}
            color={colors.martinique}
            width={20}
            height={20}
            style={{ marginBottom: -4 }}
          />
          {t('What are the Wallet Reward?')}
        </Text>
      </View>
      <PinExtension style={styles.pinExtension} />
    </TabLayoutWrapperMainContent>
  )
}

export default OnBoardingScreen

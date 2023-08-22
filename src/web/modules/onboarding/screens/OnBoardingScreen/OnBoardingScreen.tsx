import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import PlayButton from '@common/assets/svg/PlayButton'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Text from '@common/components/Text'
import colors from '@common/styles/colors'
import { AuthLayoutWrapperMainContent } from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import { storage } from '@web/extension-services/background/webapi/storage'
import PinExtension from '@web/modules/onboarding/components/PinExtension/PinExtension'
import { ONBOARDING_VALUES } from '@web/modules/onboarding/types'

import styles from './styles'

const OnBoardingScreen = () => {
  const { t } = useTranslation()

  useEffect(() => {
    storage.set('onboardingStatus', ONBOARDING_VALUES.ON_BOARDED)
  }, [])

  return (
    <AuthLayoutWrapperMainContent fullWidth hideHeader>
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
    </AuthLayoutWrapperMainContent>
  )
}

export default OnBoardingScreen

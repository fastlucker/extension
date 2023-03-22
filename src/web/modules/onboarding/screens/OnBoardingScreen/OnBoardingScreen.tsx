import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Text from '@common/components/Text'
import AmbireLogo from '@common/modules/auth/components/AmbireLogo'
import spacings from '@common/styles/spacings'
import { THEME_TYPES } from '@common/styles/themeConfig'
import text from '@common/styles/utils/text'
import {
  AuthLayoutWrapperMainContent,
  AuthLayoutWrapperSideContent
} from '@web/components/AuthLayoutWrapper/AuthLayoutWrapper'
import PinExtension from '@web/modules/onboarding/components/PinExtension/PinExtension'
import { ONBOARDING_VALUES } from '@web/modules/onboarding/contexts/onboardingContext/types'
import useOnboarding from '@web/modules/onboarding/hooks/useOnboarding'

const OnBoardingScreen = () => {
  const { t } = useTranslation()

  const { setOnboardingStatus } = useOnboarding()
  useEffect(() => {
    setOnboardingStatus(ONBOARDING_VALUES.ON_BOARDED)
  }, [setOnboardingStatus])

  return (
    <>
      <AuthLayoutWrapperMainContent>
        <AmbireLogo shouldExpand={false} />
        <Text
          themeType={THEME_TYPES.LIGHT}
          shouldScale={false}
          fontSize={20}
          style={[spacings.mbLg, text.center]}
        >
          {t('You are ready!')}
        </Text>
        <PinExtension
          style={{
            position: 'fixed',
            right: 90,
            top: -15,
            zIndex: 10
          }}
        />
      </AuthLayoutWrapperMainContent>
      <AuthLayoutWrapperSideContent
        backgroundType="beta"
        style={{ position: 'relative', zIndex: -1 }}
      ></AuthLayoutWrapperSideContent>
    </>
  )
}

export default OnBoardingScreen

import React, { useEffect } from 'react'

import GradientBackgroundWrapper from '@common/components/GradientBackgroundWrapper'
import Title from '@common/components/Title'
import Wrapper from '@common/components/Wrapper'
import { ONBOARDING_VALUES } from '@web/modules/onboarding/contexts/onboardingContext/types'
import useOnboarding from '@web/modules/onboarding/hooks/useOnboarding'

const OnBoardingScreen = () => {
  const { setOnboardingStatus } = useOnboarding()
  useEffect(() => {
    setOnboardingStatus(ONBOARDING_VALUES.ON_BOARDED)
  }, [setOnboardingStatus])

  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <Title>On Boarding screen</Title>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default OnBoardingScreen

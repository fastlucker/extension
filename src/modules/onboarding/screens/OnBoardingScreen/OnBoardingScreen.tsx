import React, { useEffect } from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import { ONBOARDING_VALUES } from '@modules/onboarding/contexts/onboardingContext/types'
import useOnboarding from '@modules/onboarding/hooks/useOnboarding'

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

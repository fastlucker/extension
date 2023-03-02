import React, { useEffect } from 'react'

import GradientBackgroundWrapper from '@modules/common/components/GradientBackgroundWrapper'
import Title from '@modules/common/components/Title'
import Wrapper from '@modules/common/components/Wrapper'
import useOnboarding from '@modules/onboarding/hooks/useOnboarding'

const OnBoardingScreen = () => {
  const { setOnBoarded } = useOnboarding()
  useEffect(() => {
    setOnBoarded(true)
  }, [setOnBoarded])

  return (
    <GradientBackgroundWrapper>
      <Wrapper>
        <Title>On Boarding screen</Title>
      </Wrapper>
    </GradientBackgroundWrapper>
  )
}

export default OnBoardingScreen

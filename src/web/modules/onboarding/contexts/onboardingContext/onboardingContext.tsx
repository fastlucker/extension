import React, { createContext, useMemo } from 'react'

import useStorage from '@common/hooks/useStorage'
import { isExtension } from '@web/constants/browserapi'

import { ONBOARDING_VALUES, OnboardingContextReturnType } from './types'

const OnboardingContext = createContext<OnboardingContextReturnType>({
  onboardingStatus: ONBOARDING_VALUES.NOT_ON_BOARDED,
  setOnboardingStatus: () => {}
})

const OnboardingProvider: React.FC<any> = ({ children }) => {
  const [onboardingStatus, setOnboardingStatus] = useStorage({
    key: 'onboardingStatus',
    defaultValue: isExtension ? ONBOARDING_VALUES.NOT_ON_BOARDED : ONBOARDING_VALUES.ON_BOARDED,
    isStringStorage: true
  })

  return (
    <OnboardingContext.Provider
      value={useMemo(
        () => ({
          onboardingStatus,
          setOnboardingStatus
        }),
        [onboardingStatus, setOnboardingStatus]
      )}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export { OnboardingContext, OnboardingProvider }

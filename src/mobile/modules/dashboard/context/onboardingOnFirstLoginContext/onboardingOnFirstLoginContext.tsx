import React, { createContext, useCallback, useMemo } from 'react'

import useStorage from '@common/hooks/useStorage'

// Type alias for ISO 8601 date strings
type ISODateString = string

const ONBOARDING_COMPLETED_AT_STORAGE_KEY = 'onboardingCompletedAt'

const OnBoardingOnFirstLoginContext = createContext<any>({
  markOnboardingOnFirstLoginAsCompleted: () => {},
  hasCompletedOnboarding: false
})

const OnboardingOnFirstLoginProvider: React.FC = ({ children }) => {
  const [completedOnboardingAt, setCompletedOnboardingAt] = useStorage({
    key: ONBOARDING_COMPLETED_AT_STORAGE_KEY,
    defaultValue: false,
    isStringStorage: true
  })

  const markOnboardingOnFirstLoginAsCompleted = useCallback(() => {
    const completedAt: ISODateString = new Date().toISOString()

    setCompletedOnboardingAt(completedAt)
  }, [setCompletedOnboardingAt])

  const hasCompletedOnboarding = !!completedOnboardingAt

  return (
    <OnBoardingOnFirstLoginContext.Provider
      value={useMemo(
        () => ({
          markOnboardingOnFirstLoginAsCompleted,
          hasCompletedOnboarding
        }),
        [markOnboardingOnFirstLoginAsCompleted, hasCompletedOnboarding]
      )}
    >
      {children}
    </OnBoardingOnFirstLoginContext.Provider>
  )
}

export { OnBoardingOnFirstLoginContext, OnboardingOnFirstLoginProvider }

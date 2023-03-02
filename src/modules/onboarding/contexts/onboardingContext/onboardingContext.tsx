import React, { createContext, useMemo } from 'react'

import useStorage from '@modules/common/hooks/useStorage'

import { OnboardingContextReturnType } from './types'

const OnboardingContext = createContext<OnboardingContextReturnType>({
  onBoarded: false,
  setOnBoarded: () => {}
})

const OnboardingProvider: React.FC<any> = ({ children }) => {
  const [onBoarded, setOnBoarded] = useStorage({
    key: 'onBoarded',
    defaultValue: false
  })

  return (
    <OnboardingContext.Provider
      value={useMemo(
        () => ({
          onBoarded,
          setOnBoarded
        }),
        [onBoarded, setOnBoarded]
      )}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export { OnboardingContext, OnboardingProvider }

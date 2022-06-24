import usePrivateMode, { UsePrivateModeReturnType } from 'ambire-common/src/hooks/usePrivateMode'
import React, { createContext, useMemo } from 'react'

import useStorage from '@modules/common/hooks/useStorage'

const PrivateModeContext = createContext<UsePrivateModeReturnType>({
  hidePrivateValue: () => '',
  togglePrivateMode: () => {},
  isPrivateMode: false
})

const PrivateModeProvider: React.FC = ({ children }) => {
  const { isPrivateMode, hidePrivateValue, togglePrivateMode } = usePrivateMode({
    useStorage
  })

  return (
    <PrivateModeContext.Provider
      value={useMemo(
        () => ({
          isPrivateMode,
          hidePrivateValue,
          togglePrivateMode
        }),
        [isPrivateMode, hidePrivateValue, togglePrivateMode]
      )}
    >
      {children}
    </PrivateModeContext.Provider>
  )
}

export { PrivateModeContext, PrivateModeProvider }

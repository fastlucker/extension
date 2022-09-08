import useFetchConstants, { WALLETInitialClaimableRewardsType } from 'ambire-common/src/hooks/useFetchConstants'
import React, { createContext, useMemo } from 'react'

const ConstantsContext = createContext<{
  constants: WALLETInitialClaimableRewardsType
  areConstantsLoading: boolean
}>({
  constants: null,
  areConstantsLoading: true
})

const ConstantsProvider: React.FC = ({ children }) => {
  const { constants, isLoading: areConstantsLoading } = useFetchConstants({ fetch })

  return (
    <ConstantsContext.Provider
      value={useMemo(() => ({ constants, areConstantsLoading }), [constants, areConstantsLoading])}
    >
      {children}
    </ConstantsContext.Provider>
  )
}

export { ConstantsContext, ConstantsProvider }

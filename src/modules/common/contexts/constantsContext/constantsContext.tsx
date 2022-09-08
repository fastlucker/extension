import useFetchConstants, { WALLETInitialClaimableRewardsType } from 'ambire-common/src/hooks/useFetchConstants'
import React, { createContext, useMemo } from 'react'

const ConstantsContext = createContext<{
  constants: WALLETInitialClaimableRewardsType | null
  isLoading: boolean
}>({
  constants: null,
  isLoading: true
})

const ConstantsProvider: React.FC = ({ children }) => {
  const { constants, isLoading } = useFetchConstants({ fetch })

  return (
    <ConstantsContext.Provider
      value={useMemo(() => ({ constants, isLoading }), [constants, isLoading])}
    >
      {children}
    </ConstantsContext.Provider>
  )
}

export { ConstantsContext, ConstantsProvider }

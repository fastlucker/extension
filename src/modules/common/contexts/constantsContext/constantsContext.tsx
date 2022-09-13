import useFetchConstants, { ConstantsType } from 'ambire-common/src/hooks/useFetchConstants'
import React, { createContext, useMemo } from 'react'

import SafeAreaView from '@modules/common/components/SafeAreaView'
import Spinner from '@modules/common/components/Spinner'
import flexboxStyles from '@modules/common/styles/utils/flexbox'

const ConstantsContext = createContext<{
  constants: ConstantsType | null
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
      {isLoading ? (
        <SafeAreaView style={[flexboxStyles.center, flexboxStyles.flex1]}>
          <Spinner />
        </SafeAreaView>
      ) : (
        children
      )}
    </ConstantsContext.Provider>
  )
}

export { ConstantsContext, ConstantsProvider }

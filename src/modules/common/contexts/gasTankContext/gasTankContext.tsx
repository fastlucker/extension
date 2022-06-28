import useGasTank, {
  GasTankEntryType,
  UseGasTankReturnType
} from 'ambire-common/src/hooks/useGasTank'
import React, { createContext, useEffect, useMemo } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useStorage from '@modules/common/hooks/useStorage'

interface GasTankContextDataType extends UseGasTankReturnType {
  currentAccGasTankState: GasTankEntryType
}

const GasTankContext = createContext<GasTankContextDataType>({
  gasTankState: [],
  currentAccGasTankState: { account: '', isEnabled: false },
  setGasTankState: () => {}
})

const GasTankProvider: React.FC = ({ children }) => {
  const { selectedAcc } = useAccounts()
  const { network } = useNetwork()
  const { gasTankState, setGasTankState } = useGasTank({
    selectedAcc,
    useStorage
  })

  useEffect(() => {
    // Gas Tank: Adding default state when the account is changed or created
    if (gasTankState.length && !gasTankState.find((i) => i.account === selectedAcc)) {
      setGasTankState([...gasTankState, { account: selectedAcc, isEnabled: false }])
    }
    // Gas Tank: Disables gas tank if the network does not support it
    if (gasTankState.length && !network?.isGasTankAvailable) {
      const currentAccGasTankState = gasTankState.find((i) => i.account === selectedAcc)

      if (currentAccGasTankState && currentAccGasTankState.isEnabled) {
        const updatedGasTankState = gasTankState.map((i) =>
          i.account === selectedAcc ? { ...i, isEnabled: false } : i
        )

        setGasTankState(updatedGasTankState)
      }
    }
  }, [gasTankState, selectedAcc, setGasTankState, network?.isGasTankAvailable])

  const currentAccGasTankState = useMemo(
    () =>
      gasTankState.length
        ? gasTankState.find((i) => i.account === selectedAcc)
        : setGasTankState([...gasTankState, { account: selectedAcc, isEnabled: false }]),
    [gasTankState, selectedAcc, setGasTankState]
  )

  return (
    <GasTankContext.Provider
      value={useMemo(
        () => ({
          gasTankState,
          currentAccGasTankState,
          setGasTankState
        }),
        [gasTankState, currentAccGasTankState, setGasTankState]
      )}
    >
      {children}
    </GasTankContext.Provider>
  )
}

export { GasTankContext, GasTankProvider }

import React, { createContext, useEffect, useMemo, useRef } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import { browserAPI } from '@web/constants/browserAPI'
import { addMessageHandler } from '@web/services/ambexMessanger'

const AmbireExtensionContext = createContext<any>({})

const AmbireExtensionProvider: React.FC = ({ children }) => {
  const { selectedAcc: selectedAccount } = useAccounts()
  const { network } = useNetwork()
  const { addToast } = useToast()
  const stateRef: any = useRef()

  stateRef.current = {
    selectedAccount,
    network
  }

  useEffect(() => {
    if (selectedAccount && network) {
      browserAPI.storage.local.set({ SELECTED_ACCOUNT: selectedAccount, NETWORK: network })
    }

    // Post-focus, display a message to the user to make him understand why he switched tabs automatically
    addMessageHandler({ type: 'displayUserInterventionNotification' }, () => {
      setTimeout(() => addToast('An user interaction has been requested'), 500)
    })
  }, [selectedAccount, network, addToast])

  return (
    <AmbireExtensionContext.Provider value={useMemo(() => ({}), [])}>
      {children}
    </AmbireExtensionContext.Provider>
  )
}

export { AmbireExtensionContext, AmbireExtensionProvider }

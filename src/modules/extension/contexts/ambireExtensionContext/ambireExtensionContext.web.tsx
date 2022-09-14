import React, { createContext, useEffect, useMemo, useRef } from 'react'

import useAccounts from '@modules/common/hooks/useAccounts'
import useNetwork from '@modules/common/hooks/useNetwork'
import useToast from '@modules/common/hooks/useToast'
import { browserAPI } from '@web/constants/browserAPI'
import {
  addMessageHandler,
  sendMessage,
  sendReply,
  setupAmbexMessenger
} from '@web/services/ambexMessanger'

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
    setupAmbexMessenger('ambirePageContext', browserAPI)

    sendMessage(
      {
        to: 'background',
        type: 'ambireWalletAccountChanged',
        data: {
          account: selectedAccount
        }
      },
      { ignoreReply: true }
    )

    sendMessage(
      {
        to: 'background',
        type: 'ambireWalletChainChanged',
        data: {
          chainId: network?.chainId
        }
      },
      { ignoreReply: true }
    )

    // Post-focus, display a message to the user to make him understand why he switched tabs automatically
    addMessageHandler({ type: 'displayUserInterventionNotification' }, () => {
      setTimeout(() => addToast('An user interaction has been requested'), 500)
    })

    // contentScript triggers this, then this(ambirePageContext) should inform proper injection to background
    addMessageHandler({ type: 'ambireContentScriptInjected' }, () => {
      sendMessage(
        {
          to: 'background',
          type: 'ambirePageContextInjected',
          data: {
            account: selectedAccount,
            chainId: network?.chainId
          }
        },
        { ignoreReply: true }
      )
    })

    // Used on extension lifecycle reloading to check if previous ambire injected tabs are still up
    addMessageHandler({ type: 'keepalive' }, (message: any) => {
      sendReply(message, {
        type: 'keepalive_reply', // only case where reply with type required (for now)
        data: {
          account: selectedAccount,
          chainId: network?.chainId
        }
      })
    })

    addMessageHandler({ type: 'extension_getCoreAccountData' }, (message: any) => {
      sendReply(message, {
        data: {
          account: selectedAccount,
          chainId: network?.chainId
        }
      })
    })
  }, [selectedAccount, network, addToast])

  return (
    <AmbireExtensionContext.Provider value={useMemo(() => ({}), [])}>
      {children}
    </AmbireExtensionContext.Provider>
  )
}

export { AmbireExtensionContext, AmbireExtensionProvider }

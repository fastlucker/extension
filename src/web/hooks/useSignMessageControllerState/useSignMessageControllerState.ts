import { useContext } from 'react'

import { SignMessageControllerStateContext } from '@web/contexts/signMessageControllerStateContext'

export default function useSignMessageControllerState() {
  const context = useContext(SignMessageControllerStateContext)

  if (!context) {
    throw new Error(
      'useSignMessageControllerState must be used within a SignMessageControllerStateProvider'
    )
  }

  return context
}

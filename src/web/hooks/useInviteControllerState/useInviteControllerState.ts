import { useContext } from 'react'

import { InviteControllerStateContext } from '@web/contexts/inviteControllerStateContext'

export default function useInviteControllerState() {
  const context = useContext(InviteControllerStateContext)

  if (!context) {
    throw new Error('useInviteControllerState must be used within a InviteControllerStateProvider')
  }

  return context
}

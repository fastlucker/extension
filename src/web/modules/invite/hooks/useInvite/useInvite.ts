import { useState } from 'react'

import { INVITE_STATUS } from './types'

export default function useInvite() {
  // TODO: Check of the invite status and store it in the storage
  const [inviteStatus, setInviteStatus] = useState<INVITE_STATUS>(INVITE_STATUS.UNCHECKED)

  return { inviteStatus }
}

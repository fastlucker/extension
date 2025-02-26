import React from 'react'

import AcceptedInvitationIcon from './AcceptedInvitationIcon'
import ExpiredInvitationIcon from './ExpiredInvitationIcon'
import PendingInvitationIcon from './PendingInvitationIcon'

export default ({ status }: { status: string }) => {
  if (status === 'pending') return <PendingInvitationIcon />
  if (status === 'accepted') return <AcceptedInvitationIcon />
  if (status === 'expired') return <ExpiredInvitationIcon />
  return null
}

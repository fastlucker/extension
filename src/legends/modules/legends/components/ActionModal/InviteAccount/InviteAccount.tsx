import React, { FC, useMemo } from 'react'

import Address from '@legends/components/Address'
import { MAX_INVITATIONS } from '@legends/modules/legends/constants'
import { CardFromResponse } from '@legends/modules/legends/types'

import styles from './InviteAccount.module.scss'

type Props = Pick<CardFromResponse, 'meta'>

const getTimeAgo = (date: string): string => {
  const msAgo = new Date().getTime() - new Date(date).getTime()
  const HOUR = 1000 * 60 * 60
  if (msAgo < HOUR / 60) return 'just now'
  if (msAgo < HOUR) return `${Math.floor(msAgo / 60)} minutes ago`
  if (msAgo < HOUR * 2) return '1 hour ago'
  if (msAgo < 24 * HOUR) return `${Math.floor(msAgo / HOUR)} hours ago`
  if (msAgo < 24 * HOUR * 2) return 'one day ago'
  if (msAgo < 24 * HOUR * 7) return `${Math.floor(msAgo / (HOUR * 24))} days ago`
  return `${Math.floor(msAgo / (HOUR * 24 * 7))} weeks ago`
}

const InviteAccount: FC<Props> = ({ meta }) => {
  const leftInvitations = useMemo(
    () => MAX_INVITATIONS - (meta?.numbersOfUsedInvitations || 0),
    [meta]
  )

  return (
    <div>
      <div className={`${styles.info} ${!leftInvitations ? styles.infoWarning : ''}`}>
        Invitations left {leftInvitations}/2
      </div>
      {meta?.usersInvitationHistory?.length && (
        <div style={{ fontSize: '1.25rem' }}>Invitations history:</div>
      )}
      {(meta?.usersInvitationHistory || []).map(({ status, invitee, date }) => (
        <div style={{ display: 'flex' }} key={invitee + date}>
          <div className={`${styles[status]}`}>{status}</div>
          <div className={`${styles.ml}`}>{getTimeAgo(date)}</div>
          <div className={`${styles.ml}`}>
            <Address maxAddressLength={12} address={invitee} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default InviteAccount

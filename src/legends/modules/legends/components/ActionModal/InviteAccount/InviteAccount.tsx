import React, { FC, useMemo } from 'react'

import Address from '@legends/components/Address'
import { MAX_INVITATIONS } from '@legends/modules/legends/constants'
import { CardFromResponse } from '@legends/modules/legends/types'

import InvitationIcon from './InvitationIcons'
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
  return (
    <div className={`${styles.historyWrapper}`}>
      <div className={`${styles.heading}`}>Invitations history:</div>
      {meta?.usersInvitationHistory?.length ? (
        (meta?.usersInvitationHistory || []).map(({ status, invitee, date }) => (
          <div
            className={`${styles.invitationItem} ${styles[status]} ${styles.mb}`}
            key={invitee + date}
          >
            <div className={`${styles.floatLeft} ${styles.bold}`}>
              {status[0].toUpperCase() + status.slice(1)}
            </div>
            <div className={`${styles.mr}`}>{getTimeAgo(date)}</div>(
            <Address className={`${styles[status]}`} maxAddressLength={12} address={invitee} />)
            <div className={`${styles.ml}`}>
              {' '}
              <InvitationIcon status={status} />{' '}
            </div>
          </div>
        ))
      ) : (
        <div>No invitations executed yet.</div>
      )}
    </div>
  )
}

export default InviteAccount

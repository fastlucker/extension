import React, { FC } from 'react'

import Address from '@legends/components/Address'
import { CardFromResponse } from '@legends/modules/legends/types'

import styles from './LinkingHistory.module.scss'

type Props = Pick<CardFromResponse, 'meta'>

const getTimeAgo = (date: string): string => {
  const dateAsMs = new Date(date).getTime()
  const msAgo = new Date().getTime() - dateAsMs
  const DAY = 1000 * 60 * 60 * 24

  if (msAgo < DAY) return 'today'
  if (msAgo < DAY * 2) return 'one day ago'
  if (msAgo < DAY * 7 * 2) return `${Math.floor(msAgo / DAY)} days ago`
  return `${Math.floor(msAgo / (DAY * 7))} weeks ago`
}

const LinkingHistory: FC<Props> = ({ meta }) => {
  return (
    <div className={`${styles.historyWrapper}`}>
      <p className={`${styles.heading}`}>Linking history</p>
      <div className={`${styles.scrollableHistory}`}>
        {[
          ...(meta?.accountLinkingHistory as any),
          ...(meta?.accountLinkingHistory as any),
          ...(meta?.accountLinkingHistory as any),
          ...(meta?.accountLinkingHistory as any)
        ].map(({ invitedEoaOrV1, date }) => (
          <div className={`${styles.invitationItem}`} key={invitedEoaOrV1}>
            <Address
              maxAddressLength={25}
              className={`${styles.accepted}`}
              address={invitedEoaOrV1}
            />
            <div className={`${styles.timeAgo}`}>{getTimeAgo(date)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LinkingHistory

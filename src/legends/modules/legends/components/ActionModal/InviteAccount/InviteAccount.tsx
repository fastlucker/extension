import React, { FC, useMemo } from 'react'

import { MAX_INVITATIONS } from '@legends/modules/legends/constants'
import { CardFromResponse } from '@legends/modules/legends/types'

import styles from './InviteAccount.module.scss'

type Props = Pick<CardFromResponse, 'meta'>

const InviteAccount: FC<Props> = ({ meta }) => {
  const leftInvitations = useMemo(
    () => MAX_INVITATIONS - (meta?.numbersOfUsedInvitations || 0),
    [meta]
  )
  return (
    <div className={`${styles.info} ${!leftInvitations ? styles.infoWarning : ''}`}>
      Invitations left {leftInvitations}/2
    </div>
  )
}

export default InviteAccount

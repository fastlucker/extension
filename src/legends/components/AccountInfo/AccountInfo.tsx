import React from 'react'

import DisconnectIcon from '@legends/common/assets/svg/DisconnectIcon'
import Address from '@legends/components/Address'
import useAccountContext from '@legends/hooks/useAccountContext'
import useCharacterContext from '@legends/hooks/useCharacterContext'

import styles from './AccountInfo.module.scss'

// TODO: Add logic to handle account switching from the dropdown
const AccountInfo = () => {
  const { connectedAccount, disconnectAccount } = useAccountContext()
  const { character } = useCharacterContext()

  return (
    <div className={`${styles.wrapper} ${connectedAccount ? styles.connected : ''}`}>
      <div className={styles.avatarWrapper}>
        <img alt="avatar" className={styles.avatar} src={character!.image_avatar} />
      </div>
      <div className={styles.account}>
        <div className={styles.accountAndArrowWrapper}>
          <Address
            skeletonClassName={styles.addressSkeleton}
            className={styles.address}
            address={connectedAccount!}
            maxAddressLength={12}
          />
          <DisconnectIcon onClick={disconnectAccount} className={styles.disconnectIcon} />
        </div>
        <p className={`${styles.levelAndRank} ${styles.activityDot}`}>Level {character!.level}</p>
      </div>
    </div>
  )
}

export default AccountInfo

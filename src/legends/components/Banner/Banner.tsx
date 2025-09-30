import React, { useMemo } from 'react'

import { CardFromResponse } from '@legends/modules/legends/types'

import styles from './Banner.module.scss'
import governance from './governance.png'

interface Props {
  activeProposals: NonNullable<NonNullable<CardFromResponse['meta']>['activeProposals']>
}
const Banner: React.FC<Props> = ({ activeProposals }) => {
  const bannerInfo = useMemo(() => {
    if (activeProposals.length === 1)
      return {
        text: `🗳️ Vote is live: ${activeProposals[0].title}`,
        url: `https://snapshot.box/#/s:ambire.eth/proposal/${activeProposals[0].id}`
      }
    return {
      text: `🗳️ ${activeProposals.length} votes are live: ${activeProposals
        .map((p) => p.title)
        .join(' ')}`,
      url: 'https://snapshot.box/#/s:ambire.eth'
    }
  }, [activeProposals])
  return (
    <div className={styles.container}>
      <img className={styles.iconPlaceholder} src={governance} alt="Governance banner icon" />
      <div className={styles.textContent}>
        <div className={styles.title}>{bannerInfo.text}</div>
        <a href={bannerInfo.url} className={styles.readMoreLink} target="_blank" rel="noreferrer">
          Read more &gt;
        </a>
      </div>
    </div>
  )
}

export default Banner

import React, { useMemo } from 'react'

import { CardFromResponse } from '@legends/modules/legends/types'

import styles from './Banner.module.scss'
import governance from './governance.png'

interface Props {
  activeProposals: NonNullable<NonNullable<CardFromResponse['meta']>['activeProposals']>
}
const Banner: React.FC<Props> = ({ activeProposals }) => {
  return (
    <div className={styles.container}>
      <img className={styles.iconPlaceholder} src={governance} alt="Governance banner icon" />
      <div className={styles.textContent}>
        {activeProposals.length === 1 ? (
          <div className={styles.title}>
            🗳️ {activeProposals[0].title} Vote until{' '}
            {new Date(activeProposals[0].end * 1000).toLocaleString('en', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        ) : (
          <>
            <div className={styles.title}>
              🗳️ {activeProposals.length} governance proposals are live, vote until{' '}
              {new Date(activeProposals.sort((a, b) => a.end - b.end)[0].end * 1000).toLocaleString(
                'en',
                { month: 'short', day: 'numeric' }
              )}
            </div>
            {activeProposals.map(({ id, title }) => {
              return (
                <>
                  <a
                    href={`https://snapshot.box/#/s:ambire.eth/proposal/${id}`}
                    className={styles.readMoreLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {title}
                  </a>
                  <br />
                </>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

export default Banner

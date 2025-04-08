import React from 'react'

import Page from '@legends/components/Page'
import Spinner from '@legends/components/Spinner'
import useLegendsContext from '@legends/hooks/useLegendsContext'
import Card from '@legends/modules/legends/components/Card'

import styles from './Legends.module.scss'

enum CardGroup {
  'show' = 'Show',
  'swap-and-bridge' = 'Swap And Bridge',
  'supporter' = 'Supporter',
  'gas-tank' = 'Gas Tank',
  'transactions' = 'Transactions',
  'seasonal' = 'Seasonal',
  'mini-game' = 'Mini Game'
}

const Legends = () => {
  const { legends, isLoading } = useLegendsContext()

  const groupedLegends = legends.reduce((groups, card) => {
    const group = card.group || 'Ungrouped'
    return {
      ...groups,
      [group]: [...(groups[group] || []), card]
    }
  }, {} as Record<string, typeof legends>)

  return (
    <Page containerSize="lg">
      {!isLoading ? (
        <div>
          {Object.entries(groupedLegends).map(([groupName, cards]) => (
            <div key={groupName} className={styles.group}>
              <h2 className={styles.groupName}>{CardGroup[groupName as keyof typeof CardGroup]}</h2>
              <div className={styles.cards}>
                {cards.map((card) => (
                  <Card key={card.title + card.card.type} cardData={card} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}
    </Page>
  )
}

export default Legends

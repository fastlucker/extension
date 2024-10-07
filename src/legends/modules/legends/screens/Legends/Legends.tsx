import React, { useState } from 'react'

import Page from '@legends/components/Page'
import Card from '@legends/modules/legends/components/Card'
import Topbar from '@legends/modules/legends/components/Topbar'
import { Filter } from '@legends/modules/legends/types/filter'

import styles from './Legends.module.scss'
import { MOCK_CARDS, MOCK_FILTERS } from './mockData'

const Legends = () => {
  const [selectedFilter, setSelectedFilter] = useState<Filter['value']>(MOCK_FILTERS[0].value)

  const selectFilter = (filter: Filter) => {
    setSelectedFilter(filter.value)
  }

  return (
    <Page>
      <Topbar filters={MOCK_FILTERS} selectedFilter={selectedFilter} selectFilter={selectFilter} />
      <div className={styles.cards}>
        {MOCK_CARDS.map((card) => (
          <Card key={card.heading} {...card}>
            {card.action ? (
              <button className={styles.button} type="button" onClick={card.action.onClick}>
                {card.action.label}
              </button>
            ) : null}
          </Card>
        ))}
      </div>
    </Page>
  )
}

export default Legends

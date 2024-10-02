import React, { useState } from 'react'

import Page from '@legends/components/Page'
import useToast from '@legends/hooks/useToast'
import Card from '@legends/modules/legends/components/Card'
import Topbar from '@legends/modules/legends/components/Topbar'
import { Filter } from '@legends/modules/legends/types/filter'

import styles from './Legends.module.scss'
import { MOCK_CARDS, MOCK_FILTERS } from './mockData'

const Legends = () => {
  const { addToast } = useToast()
  const [selectedFilter, setSelectedFilter] = useState<Filter['value']>(MOCK_FILTERS[0].value)

  const selectFilter = (filter: Filter) => {
    addToast('info', `Selected filter: ${filter.label}`)
    setTimeout(() => addToast('error', `Selected filter: ${filter.label}`), 100)
    setTimeout(() => addToast('warning', `Selected filter: ${filter.label}`), 200)
    setTimeout(() => addToast('success', `Selected filter: ${filter.label}`), 300)
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

import React, { useState } from 'react'

import Page from '@legends/components/Page'
import useAccountContext from '@legends/hooks/useAccountContext'
import Card from '@legends/modules/legends/components/Card'
import Topbar from '@legends/modules/legends/components/Topbar'
import { useLegends } from '@legends/modules/legends/hooks'
import { Filter } from '@legends/modules/legends/types'

import styles from './Legends.module.scss'
import { MOCK_FILTERS } from './mockData'

const Legends = () => {
  const { connectedAccount } = useAccountContext()
  const [selectedFilter, setSelectedFilter] = useState<Filter['value']>(MOCK_FILTERS[0].value)

  const { legends, isLoading, completedCount } = useLegends({ connectedAccount })

  const selectFilter = (filter: Filter) => {
    setSelectedFilter(filter.value)
  }

  return (
    <Page>
      <Topbar
        filters={MOCK_FILTERS}
        selectedFilter={selectedFilter}
        selectFilter={selectFilter}
        completedCount={completedCount}
        legendsCount={legends.length}
      />
      {!isLoading ? (
        <div className={styles.cards}>
          {legends.map((card) => (
            <Card
              key={card.title + card.card.type}
              title={card.title}
              description={card.description}
              image={card.image}
              xp={card.xp}
              card={card.card}
              action={card.action}
            />
          ))}
        </div>
      ) : (
        // TODO: Replace with a Spinner
        <div>Loading...</div>
      )}
    </Page>
  )
}

export default Legends

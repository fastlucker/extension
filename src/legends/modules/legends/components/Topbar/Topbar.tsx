import React, { FC } from 'react'

import Tabs from '@legends/components/Tabs'
import { Filter } from '@legends/modules/legends/screens/Legends/Legends'

import styles from './Topbar.module.scss'

type Props = {
  filters: Filter[]
  selectedFilter: Filter['value']
  selectFilter: (filter: Filter) => void
}

const Topbar: FC<Props> = ({ filters, selectedFilter, selectFilter }) => {
  return (
    <div className={styles.wrapper}>
      <Tabs>
        {filters.map((filter) => (
          <Tabs.Tab
            onClick={() => selectFilter(filter)}
            isSelected={selectedFilter === filter.value}
            key={filter.value}
          >
            {filter.label}
          </Tabs.Tab>
        ))}
      </Tabs>
      <p className={styles.collected}>3 / 6 COLLECTED</p>
    </div>
  )
}

export default Topbar

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react'

import Tabs from '@legends/components/Tabs'
import { Filter } from '@legends/modules/legends/types'

import styles from './Topbar.module.scss'

type Props = {
  filters: Filter[]
  selectedFilter: Filter['value']
  selectFilter: (filter: Filter) => void
  completedCount: number
  legendsCount: number
}

const Topbar: FC<Props> = ({
  filters,
  selectedFilter,
  selectFilter,
  completedCount,
  legendsCount
}) => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Legends</h1>
      {/* Hide tabs for now */}
      {/* <Tabs>
        {filters.map((filter) => (
          <Tabs.Tab
            onClick={() => selectFilter(filter)}
            isSelected={selectedFilter === filter.value}
            key={filter.value}
          >
            {filter.label}
          </Tabs.Tab>
        ))}
      </Tabs> */}
      <p className={styles.collected}>
        {completedCount} / {legendsCount} COLLECTED
      </p>
    </div>
  )
}

export default Topbar

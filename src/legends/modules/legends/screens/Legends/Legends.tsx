import React, { useState } from 'react'

import Page from '@legends/components/Page'
import Topbar from '@legends/modules/legends/components/Topbar'

export type Filter = {
  label: string
  value: string
}
const MOCK_FILTERS: Filter[] = [
  {
    label: 'All Legends',
    value: 'all'
  },
  {
    label: 'DeFi',
    value: 'defi'
  },
  {
    label: 'Social',
    value: 'social'
  },
  {
    label: 'NFT',
    value: 'nft'
  }
]

const Legends = () => {
  const [selectedFilter, setSelectedFilter] = useState<Filter['value']>(MOCK_FILTERS[0].value)

  const selectFilter = (filter: Filter) => {
    setSelectedFilter(filter.value)
  }

  return (
    <Page>
      <Topbar filters={MOCK_FILTERS} selectedFilter={selectedFilter} selectFilter={selectFilter} />
    </Page>
  )
}

export default Legends

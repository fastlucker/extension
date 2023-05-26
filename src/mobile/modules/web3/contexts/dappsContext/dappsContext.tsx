import useDapps from 'ambire-common/src/hooks/useDapps'
import React, { createContext, useMemo } from 'react'

import useStorage from '@common/hooks/useStorage'

import { DappsContextData } from './types'

const DappsContext = createContext<DappsContextData>({
  addCustomDapp: () => {},
  loadDappFromUrl: () => false,
  isDappMode: false,
  currentDappData: null,
  toggleFavorite: () => {},
  favorites: {},
  filteredCatalog: [],
  onCategorySelect: () => {},
  categoryFilter: { name: '', filter: () => false },
  search: undefined,
  onSearchChange: () => {},
  categories: [],
  loadCurrentDappData: () => {}
})

const DappsProvider: React.FC<any> = ({ children }) => {
  const {
    addCustomDapp,
    loadDappFromUrl,
    isDappMode,
    currentDappData,
    toggleFavorite,
    favorites,
    filteredCatalog,
    onCategorySelect,
    categoryFilter,
    search,
    onSearchChange,
    categories,
    loadCurrentDappData,
    removeCustomDapp
  } = useDapps({ useStorage, fetch, applicationType: 'mobile' })

  return (
    <DappsContext.Provider
      value={useMemo(
        () => ({
          addCustomDapp,
          loadDappFromUrl,
          isDappMode,
          currentDappData,
          toggleFavorite,
          favorites,
          filteredCatalog,
          onCategorySelect,
          categoryFilter,
          search,
          onSearchChange,
          categories,
          loadCurrentDappData,
          removeCustomDapp
        }),
        [
          addCustomDapp,
          loadDappFromUrl,
          isDappMode,
          currentDappData,
          toggleFavorite,
          favorites,
          filteredCatalog,
          onCategorySelect,
          categoryFilter,
          search,
          onSearchChange,
          categories,
          loadCurrentDappData,
          removeCustomDapp
        ]
      )}
    >
      {children}
    </DappsContext.Provider>
  )
}

export { DappsContext, DappsProvider }

import React, { createContext, useCallback, useMemo, useState } from 'react'

import {
  LARGE_PAGE_STEP,
  NUMBER_OF_VISIBLE_ADDRESSES,
  SMALL_PAGE_STEP
} from '@web/modules/accounts-importer/constants/pagination'

import { AccountsPaginationContextData } from './types'

const AccountsPaginationContext = createContext<AccountsPaginationContextData>({
  page: 1,
  pageStartIndex: 0,
  pageEndIndex: 4,
  handleLargePageStepDecrement: () => {},
  handleSmallPageStepDecrement: () => {},
  handleSmallPageStepIncrement: () => {},
  handleLargePageStepIncrement: () => {}
})

const AccountsPaginationProvider: React.FC<any> = ({ children }) => {
  const [page, setPage] = useState<number>(1)

  const handleLargePageStepDecrement = useCallback(() => {
    if (page <= LARGE_PAGE_STEP || page - LARGE_PAGE_STEP <= 0) {
      setPage(1)
      return
    }
    setPage((p) => p - LARGE_PAGE_STEP)
  }, [page])

  const handleSmallPageStepDecrement = useCallback(() => {
    if (page - SMALL_PAGE_STEP < 1) return

    setPage((p) => p - SMALL_PAGE_STEP)
  }, [page])

  const handleSmallPageStepIncrement = useCallback(() => {
    setPage((p) => p + SMALL_PAGE_STEP)
  }, [])

  const handleLargePageStepIncrement = useCallback(() => {
    setPage((p) => p + LARGE_PAGE_STEP)
  }, [])

  const pageStartIndex = useMemo(() => {
    return (page - 1) * NUMBER_OF_VISIBLE_ADDRESSES
  }, [page])

  const pageEndIndex = useMemo(() => {
    return (page - 1) * NUMBER_OF_VISIBLE_ADDRESSES + 4
  }, [page])

  return (
    <AccountsPaginationContext.Provider
      value={useMemo(
        () => ({
          page,
          pageStartIndex,
          pageEndIndex,
          handleLargePageStepDecrement,
          handleSmallPageStepDecrement,
          handleSmallPageStepIncrement,
          handleLargePageStepIncrement
        }),
        [
          page,
          pageStartIndex,
          pageEndIndex,
          handleLargePageStepDecrement,
          handleSmallPageStepDecrement,
          handleSmallPageStepIncrement,
          handleLargePageStepIncrement
        ]
      )}
    >
      {children}
    </AccountsPaginationContext.Provider>
  )
}

export { AccountsPaginationContext, AccountsPaginationProvider }

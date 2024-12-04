import React, { FC } from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import usePagination, { DOTS } from '@common/hooks/usePagination'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

import PaginationItem from './PaginationItem'

export const SMALL_PAGE_STEP = 1
export const LARGE_PAGE_STEP = 10

interface Props {
  page: number
  maxPages: number
  setPage: (page: number) => void
  isNextDisabled?: boolean
  isPrevDisabled?: boolean
  isDisabled?: boolean
  style?: ViewStyle
  hideLastPage?: boolean
}

const Pagination: FC<Props> = ({
  page,
  maxPages,
  setPage,
  isNextDisabled,
  isPrevDisabled,
  isDisabled,
  style,
  hideLastPage
}) => {
  const paginationRange = usePagination({
    currentPage: page,
    maxPages,
    siblingCount: 1,
    hideLastPage
  })

  const handleSmallPageStepDecrement = () => {
    setPage(page - SMALL_PAGE_STEP)
  }

  const handleSmallPageStepIncrement = () => {
    setPage(page + SMALL_PAGE_STEP)
  }

  const handleLargePageStepDecrement = () => {
    if (page <= LARGE_PAGE_STEP) {
      setPage(1)
    } else {
      setPage(page - LARGE_PAGE_STEP)
    }
  }

  const handleLargePageStepIncrement = () => {
    if (page + LARGE_PAGE_STEP >= maxPages) {
      setPage(maxPages)
      return
    }

    setPage(page + LARGE_PAGE_STEP)
  }

  return (
    <View style={[flexbox.directionRow, flexbox.justifyEnd, flexbox.alignCenter, style]}>
      <TouchableOpacity
        onPress={handleLargePageStepDecrement}
        disabled={page === 1 || isPrevDisabled || isDisabled}
        style={[spacings.mrTy, (page === 1 || isPrevDisabled || isDisabled) && { opacity: 0.4 }]}
      >
        <View style={flexbox.directionRow}>
          <LeftArrowIcon />
          <LeftArrowIcon />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleSmallPageStepDecrement}
        disabled={page === 1 || isPrevDisabled || isDisabled}
        style={(page === 1 || isPrevDisabled || isDisabled) && { opacity: 0.4 }}
      >
        <LeftArrowIcon />
      </TouchableOpacity>
      <View style={[flexbox.directionRow, spacings.phSm]}>
        {paginationRange.map((pageNumber) => {
          if (typeof pageNumber !== 'number' || String(pageNumber).includes(DOTS)) {
            return <PaginationItem key={pageNumber} />
          }

          return (
            <PaginationItem
              key={pageNumber}
              number={pageNumber}
              setPage={setPage}
              isActive={pageNumber === page}
              isDisabled={isDisabled}
            />
          )
        })}
      </View>
      <TouchableOpacity
        style={[spacings.mrTy, (isNextDisabled || isDisabled) && { opacity: 0.4 }]}
        disabled={isNextDisabled || isDisabled}
        onPress={handleSmallPageStepIncrement}
      >
        <RightArrowIcon />
      </TouchableOpacity>
      <TouchableOpacity
        style={(isNextDisabled || isDisabled) && { opacity: 0.4 }}
        disabled={isNextDisabled || isDisabled}
        onPress={handleLargePageStepIncrement}
      >
        <View style={flexbox.directionRow}>
          <RightArrowIcon />
          <RightArrowIcon />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Pagination

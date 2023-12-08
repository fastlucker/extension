import React, { FC } from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'

import LeftArrowIcon from '@common/assets/svg/LeftArrowIcon'
import RightArrowIcon from '@common/assets/svg/RightArrowIcon'
import Text from '@common/components/Text'
import spacings from '@common/styles/spacings'
import flexbox from '@common/styles/utils/flexbox'

export const SMALL_PAGE_STEP = 1
export const LARGE_PAGE_STEP = 10

interface Props {
  page: number
  setPage: (page: number) => void
  isNextDisabled?: boolean
  isPrevDisabled?: boolean
  isDisabled?: boolean
  style?: ViewStyle
}

const Pagination: FC<Props> = ({
  page,
  setPage,
  isNextDisabled,
  isPrevDisabled,
  isDisabled,
  style
}) => {
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
    setPage(page + LARGE_PAGE_STEP)
  }

  return (
    <View style={[flexbox.directionRow, flexbox.justifyEnd, flexbox.alignCenter, style]}>
      <TouchableOpacity
        onPress={handleLargePageStepDecrement}
        disabled={page === 1 || isPrevDisabled || isDisabled}
        style={[spacings.mrLg, (page === 1 || isPrevDisabled || isDisabled) && { opacity: 0.4 }]}
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
      <Text style={spacings.phLg}>
        {page > 2 && <Text>...</Text>}
        {page === 1 && (
          <Text>
            <Text weight="semiBold">{page}</Text>
            <Text>{`  ${page + 1}  ${page + 2}`}</Text>
          </Text>
        )}
        {page !== 1 && (
          <Text>
            <Text>{`  ${page - 1}  `}</Text>
            <Text weight="semiBold">{page}</Text>
            <Text>{`  ${page + 1}`}</Text>
          </Text>
        )}
        <Text>{'  ...'}</Text>
      </Text>
      <TouchableOpacity
        style={[spacings.mrLg, (isNextDisabled || isDisabled) && { opacity: 0.4 }]}
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

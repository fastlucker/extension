import React from 'react'
import { FlatList } from 'react-native'

import EmptyListPlaceholder from './components/EmptyListPlaceholder'
import SelectContainer from './components/SelectContainer'
import { SelectProps } from './types'
import useSelectInternal from './useSelectInternal'

const Select = ({
  setValue,
  value,
  options,
  testID,
  menuOptionHeight,
  attemptToFetchMoreOptions,
  emptyListPlaceholderText,
  ...props
}: SelectProps) => {
  const selectData = useSelectInternal({
    value,
    setValue,
    data: options,
    isSectionList: false,
    menuOptionHeight,
    attemptToFetchMoreOptions
  })
  const { filteredData, renderItem, keyExtractor, getItemLayout } = selectData

  return (
    <SelectContainer value={value} setValue={setValue} {...selectData} {...props} testID={testID}>
      <FlatList
        data={filteredData as SelectProps['options']}
        renderItem={renderItem as any}
        keyExtractor={keyExtractor}
        initialNumToRender={15}
        windowSize={10}
        maxToRenderPerBatch={20}
        removeClippedSubviews
        getItemLayout={getItemLayout}
        ListEmptyComponent={<EmptyListPlaceholder placeholderText={emptyListPlaceholderText} />}
      />
    </SelectContainer>
  )
}

export default React.memo(Select)

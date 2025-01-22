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
    options,
    menuOptionHeight,
    attemptToFetchMoreOptions
  })
  const { filteredOptions, renderItem, keyExtractor, getItemLayout } = selectData

  return (
    <SelectContainer value={value} setValue={setValue} {...selectData} {...props} testID={testID}>
      <FlatList
        data={filteredOptions}
        renderItem={renderItem}
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

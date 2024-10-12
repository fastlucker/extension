/* eslint-disable react/prop-types */
import React, { useMemo } from 'react'
import { FlatList } from 'react-native'

import EmptyListPlaceholder from './components/EmptyListPlaceholder'
import SelectContainer from './components/SelectContainer'
import { SelectProps } from './types'
import useSelectInternal from './useSelectInternal'

const Select = ({ setValue, value, options, testID, menuOptionHeight, ...props }: SelectProps) => {
  const selectData = useSelectInternal({ menuOptionHeight, setValue, value })
  const { renderItem, keyExtractor, getItemLayout, search } = selectData

  const filteredOptions = useMemo(() => {
    if (!search) return options
    return options.filter((o) => {
      let found: boolean = o.value.toString().toLowerCase().includes(search.toLowerCase())
      if (!found && typeof o.label === 'string') {
        found = o.label.toLowerCase().includes(search.toLowerCase())
      }

      return found
    })
  }, [options, search])

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
        ListEmptyComponent={<EmptyListPlaceholder />}
      />
    </SelectContainer>
  )
}

export default React.memo(Select)

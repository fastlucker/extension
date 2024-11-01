/* eslint-disable react/prop-types */
import React, { useMemo } from 'react'
import { FlatList } from 'react-native'

import EmptyListPlaceholder from './components/EmptyListPlaceholder'
import SelectContainer from './components/SelectContainer'
import { SelectProps, SelectValue } from './types'
import useSelectInternal from './useSelectInternal'

const Select = ({ setValue, value, options, testID, menuOptionHeight, ...props }: SelectProps) => {
  const selectData = useSelectInternal({ menuOptionHeight, setValue, value })
  const { renderItem, keyExtractor, getItemLayout, search } = selectData

  const filteredOptions = useMemo(() => {
    if (!search) return options

    const normalizedSearchTerm = search.toLowerCase()
    const { exactMatches, partialMatches } = options.reduce(
      (result, o) => {
        const { value, label, extraSearchProps } = o

        const fieldsToBeSearchedInto = [
          value.toString().toLowerCase(),
          // In case the label is string, include it (could be any ReactNode)
          typeof label === 'string' ? label.toLowerCase() : '',
          ...(extraSearchProps
            ? Object.values(extraSearchProps).map((field: unknown) => String(field).toLowerCase())
            : [])
        ]

        // Prioritize exact matches, partial matches come after
        const isExactMatch = fieldsToBeSearchedInto.some((field) => field === normalizedSearchTerm)
        if (isExactMatch) {
          result.exactMatches.push(o)
        } else if (fieldsToBeSearchedInto.some((field) => field.includes(normalizedSearchTerm))) {
          result.partialMatches.push(o)
        }

        return result
      },
      { exactMatches: [] as SelectValue[], partialMatches: [] as SelectValue[] }
    )

    return [...exactMatches, ...partialMatches]
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

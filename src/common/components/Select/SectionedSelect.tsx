/* eslint-disable react/prop-types */
import React, { useMemo } from 'react'
import { SectionList } from 'react-native'

import EmptyListPlaceholder from './components/EmptyListPlaceholder'
import SelectContainer from './components/SelectContainer'
import { SectionedSelectProps, SelectValue } from './types'
import useSelectInternal from './useSelectInternal'

const SectionedSelect = ({
  setValue,
  value,
  sections,
  menuOptionHeight,
  renderSectionHeader,
  SectionSeparatorComponent,
  stickySectionHeadersEnabled,
  testID,
  ...props
}: SectionedSelectProps) => {
  const selectData = useSelectInternal({ menuOptionHeight, setValue, value })
  const { renderItem, keyExtractor, search } = selectData

  const filteredSections = useMemo(() => {
    if (!search) return sections

    const normalizedSearchTerm = search.toLowerCase()

    const sectionsWithFilteredData = sections.map((section) => {
      const { exactMatches, partialMatches } = section.data.reduce(
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
          const isExactMatch = fieldsToBeSearchedInto.some((f) => f === normalizedSearchTerm)
          const isPartialMatch = fieldsToBeSearchedInto.some((f) =>
            f.includes(normalizedSearchTerm)
          )
          if (isExactMatch) {
            result.exactMatches.push(o)
          } else if (isPartialMatch) {
            result.partialMatches.push(o)
          }

          return result
        },
        { exactMatches: [] as SelectValue[], partialMatches: [] as SelectValue[] }
      )

      return {
        ...section,
        data: [...exactMatches, ...partialMatches]
      }
    })

    return sectionsWithFilteredData.every((section) => section.data.length === 0)
      ? []
      : sectionsWithFilteredData
  }, [sections, search])

  return (
    <SelectContainer value={value} setValue={setValue} {...selectData} {...props} testID={testID}>
      <SectionList
        sections={filteredSections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={keyExtractor}
        initialNumToRender={15}
        windowSize={10}
        maxToRenderPerBatch={20}
        SectionSeparatorComponent={SectionSeparatorComponent}
        removeClippedSubviews
        ListEmptyComponent={<EmptyListPlaceholder />}
        stickySectionHeadersEnabled={stickySectionHeadersEnabled}
      />
    </SelectContainer>
  )
}

export default React.memo(SectionedSelect)
